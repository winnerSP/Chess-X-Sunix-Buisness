#include <fstream>
#include <cstdint>
#include <cstring>

#pragma pack(push, 1)

struct DOSHeader {
    uint16_t e_magic;
    uint8_t  unused[58];
    uint32_t e_lfanew;
};

struct COFFHeader {
    uint16_t machine;
    uint16_t numberOfSections;
    uint32_t timeDateStamp;
    uint32_t pointerToSymbolTable;
    uint32_t numberOfSymbols;
    uint16_t sizeOfOptionalHeader;
    uint16_t characteristics;
};

struct DataDirectory {
    uint32_t virtualAddress;
    uint32_t size;
};

struct OptionalHeader64 {
    uint16_t magic;
    uint8_t  majorLinkerVersion;
    uint8_t  minorLinkerVersion;
    uint32_t sizeOfCode;
    uint32_t sizeOfInitializedData;
    uint32_t sizeOfUninitializedData;
    uint32_t addressOfEntryPoint;
    uint32_t baseOfCode;
    uint64_t imageBase;
    uint32_t sectionAlignment;
    uint32_t fileAlignment;
    uint16_t majorOperatingSystemVersion;
    uint16_t minorOperatingSystemVersion;
    uint16_t majorImageVersion;
    uint16_t minorImageVersion;
    uint16_t majorSubsystemVersion;
    uint16_t minorSubsystemVersion;
    uint32_t win32VersionValue;
    uint32_t sizeOfImage;
    uint32_t sizeOfHeaders;
    uint32_t checkSum;
    uint16_t subsystem;
    uint16_t dllCharacteristics;
    uint64_t sizeOfStackReserve;
    uint64_t sizeOfStackCommit;
    uint64_t sizeOfHeapReserve;
    uint64_t sizeOfHeapCommit;
    uint32_t loaderFlags;
    uint32_t numberOfRvaAndSizes;
    DataDirectory dataDirectory[16];
};

struct SectionHeader {
    char     name[8];
    uint32_t virtualSize;
    uint32_t virtualAddress;
    uint32_t sizeOfRawData;
    uint32_t pointerToRawData;
    uint32_t pointerToRelocations;
    uint32_t pointerToLinenumbers;
    uint16_t numberOfRelocations;
    uint16_t numberOfLinenumbers;
    uint32_t characteristics;
};

#pragma pack(pop)

int main() {
    // x86-64:
    // xor eax,eax
    // ret
    //
    // This simply returns 0.
    const uint8_t code[] = {
        0x31, 0xC0,
        0xC3
    };

    DOSHeader dos{};
    dos.e_magic = 0x5A4D;      // "MZ"
    dos.e_lfanew = 0x80;       // PE header location

    COFFHeader coff{};
    coff.machine = 0x8664;     // AMD64
    coff.numberOfSections = 1;
    coff.sizeOfOptionalHeader = sizeof(OptionalHeader64);
    coff.characteristics = 0x0022;

    OptionalHeader64 optional{};
    optional.magic = 0x20B;             // PE32+
    optional.sizeOfCode = 0x200;
    optional.addressOfEntryPoint = 0x1000;
    optional.baseOfCode = 0x1000;
    optional.imageBase = 0x140000000;
    optional.sectionAlignment = 0x1000;
    optional.fileAlignment = 0x200;

    optional.majorOperatingSystemVersion = 6;
    optional.majorSubsystemVersion = 6;

    optional.sizeOfImage = 0x2000;
    optional.sizeOfHeaders = 0x200;

    optional.subsystem = 3;             // Console
    optional.dllCharacteristics = 0x8160;

    optional.sizeOfStackReserve = 0x100000;
    optional.sizeOfStackCommit = 0x1000;
    optional.sizeOfHeapReserve = 0x100000;
    optional.sizeOfHeapCommit = 0x1000;

    optional.numberOfRvaAndSizes = 16;

    SectionHeader text{};
    std::memcpy(text.name, ".text", 5);

    text.virtualSize = sizeof(code);
    text.virtualAddress = 0x1000;

    // File alignment = 0x200
    text.sizeOfRawData = 0x200;
    text.pointerToRawData = 0x200;

    // Executable + readable + code
    text.characteristics = 0x60000020;

    std::ofstream file("CXSDB.exe", std::ios::binary);

    if (!file) {
        return 1;
    }

    // DOS header
    file.write(
        reinterpret_cast<const char*>(&dos),
        sizeof(dos)
    );

    // Pad until PE header at 0x80
    uint8_t zero = 0;

    while (file.tellp() < 0x80) {
        file.write(reinterpret_cast<const char*>(&zero), 1);
    }

    // PE signature
    const uint32_t peSignature = 0x00004550; // "PE\0\0"

    file.write(
        reinterpret_cast<const char*>(&peSignature),
        sizeof(peSignature)
    );

    // COFF header
    file.write(
        reinterpret_cast<const char*>(&coff),
        sizeof(coff)
    );

    // Optional header
    file.write(
        reinterpret_cast<const char*>(&optional),
        sizeof(optional)
    );

    // Section header
    file.write(
        reinterpret_cast<const char*>(&text),
        sizeof(text)
    );

    // Pad headers to 0x200 bytes
    while (file.tellp() < 0x200) {
        file.write(reinterpret_cast<const char*>(&zero), 1);
    }

    // Our actual machine code
    file.write(
        reinterpret_cast<const char*>(code),
        sizeof(code)
    );

    // Pad .text section to 0x200 bytes
    while (file.tellp() < 0x400) {
        file.write(reinterpret_cast<const char*>(&zero), 1);
    }

    file.close();

    return 0;
}
