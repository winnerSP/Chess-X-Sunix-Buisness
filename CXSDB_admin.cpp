#include <iostream>
#include <fstream>
#include <filesystem>
#include <cstdint>
#include <iomanip>

namespace fs = std::filesystem;

class CXSDB_Admin {

private:

    const std::string DATABASE_DIRECTORY = "database/";

    struct DatabaseHeader {
        char signature[5];
        uint8_t version;
    };

    struct StorageRecord {
        uint64_t user_id;
        uint64_t bytes_used;
    };

    bool validateHeader(std::ifstream& file) {

        DatabaseHeader header{};

        file.read(
            reinterpret_cast<char*>(&header),
            sizeof(header)
        );

        if (!file)
            return false;

        const char expected[] = {
            'C', 'X', 'S', 'D', 'B'
        };

        for (int i = 0; i < 5; i++) {

            if (header.signature[i] != expected[i])
                return false;
        }

        if (header.version != 1)
            return false;

        return true;
    }

    std::string formatBytes(uint64_t bytes) const {

        std::ostringstream output;

        if (bytes < 1024) {

            output << bytes << " B";
        }
        else if (bytes < 1024 * 1024) {

            output << std::fixed
                   << std::setprecision(2)
                   << (static_cast<double>(bytes) / 1024.0)
                   << " KB";
        }
        else if (bytes < 1024ULL * 1024ULL * 1024ULL) {

            output << std::fixed
                   << std::setprecision(2)
                   << (static_cast<double>(bytes) /
                       (1024.0 * 1024.0))
                   << " MB";
        }
        else {

            output << std::fixed
                   << std::setprecision(2)
                   << (static_cast<double>(bytes) /
                       (1024.0 * 1024.0 * 1024.0))
                   << " GB";
        }

        return output.str();
    }

public:

    void monitorStorage() {

        std::string path =
            DATABASE_DIRECTORY + "storage.cxsdb";

        std::cout << "\n";
        std::cout << "================================\n";
        std::cout << "       CXSDB STORAGE ADMIN\n";
        std::cout << "================================\n\n";

        if (!fs::exists(path)) {

            std::cout
                << "ERROR: storage.cxsdb not found.\n";

            return;
        }

        std::ifstream file(
            path,
            std::ios::binary
        );

        if (!file) {

            std::cout
                << "ERROR: Cannot open storage database.\n";

            return;
        }

        if (!validateHeader(file)) {

            std::cout
                << "ERROR: Invalid CXSDB header.\n";

            return;
        }

        uint64_t totalStorage = 0;
        uint64_t recordCount = 0;

        StorageRecord record{};

        std::cout << "Storage records:\n";
        std::cout << "--------------------------------\n";

        while (
            file.read(
                reinterpret_cast<char*>(&record),
                sizeof(StorageRecord)
            )
        ) {

            std::cout
                << "User ID : "
                << record.user_id
                << "\n";

            std::cout
                << "Storage : "
                << formatBytes(record.bytes_used)
                << "\n\n";

            totalStorage += record.bytes_used;

            recordCount++;
        }

        file.close();

        std::cout << "--------------------------------\n";

        std::cout
            << "Records        : "
            << recordCount
            << "\n";

        std::cout
            << "Total storage  : "
            << formatBytes(totalStorage)
            << "\n";

        std::cout
            << "================================\n";
        std::cout
            << "       STORAGE MONITOR READY\n";
        std::cout
            << "================================\n";
    }
};


int main() {

    CXSDB_Admin admin;

    admin.monitorStorage();

    return 0;
}
