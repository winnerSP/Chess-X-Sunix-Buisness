#include <iostream>
#include <fstream>
#include <filesystem>
#include <string>
#include <cstdint>

namespace fs = std::filesystem;

class CXSDB {
private:

    static constexpr uint32_t VERSION = 1;

    const std::string DATABASE_DIRECTORY = "database/";

    struct DatabaseHeader {
        char signature[5];
        uint8_t version;
    };

    bool createDatabaseFile(const std::string& filename) {

        std::ofstream file(
            DATABASE_DIRECTORY + filename,
            std::ios::binary
        );

        if (!file)
            return false;

        DatabaseHeader header = {
            {'C', 'X', 'S', 'D', 'B'},
            VERSION
        };

        file.write(
            reinterpret_cast<const char*>(&header),
            sizeof(header)
        );

        file.close();

        return true;
    }

public:

    CXSDB() {

        // Create database directory
        fs::create_directories(DATABASE_DIRECTORY);
    }

    bool initialize() {

        bool success = true;

        if (!fs::exists(DATABASE_DIRECTORY + "users.cxsdb"))
            success &= createDatabaseFile("users.cxsdb");

        if (!fs::exists(DATABASE_DIRECTORY + "games.cxsdb"))
            success &= createDatabaseFile("games.cxsdb");

        if (!fs::exists(DATABASE_DIRECTORY + "ratings.cxsdb"))
            success &= createDatabaseFile("ratings.cxsdb");

        if (!fs::exists(DATABASE_DIRECTORY + "puzzles.cxsdb"))
            success &= createDatabaseFile("puzzles.cxsdb");

        if (!fs::exists(DATABASE_DIRECTORY + "chats.cxsdb"))
            success &= createDatabaseFile("chats.cxsdb");

        return success;
    }

    void status() const {

        std::cout << "\n";
        std::cout << "========================\n";
        std::cout << "       CXSDB V1\n";
        std::cout << "========================\n\n";

        std::cout << "Database directory:\n";
        std::cout << DATABASE_DIRECTORY << "\n\n";

        std::cout << "Database files:\n";

        std::cout << "["
                  << (fs::exists(DATABASE_DIRECTORY + "users.cxsdb")
                      ? "OK" : "ERROR")
                  << "] users.cxsdb\n";

        std::cout << "["
                  << (fs::exists(DATABASE_DIRECTORY + "games.cxsdb")
                      ? "OK" : "ERROR")
                  << "] games.cxsdb\n";

        std::cout << "["
                  << (fs::exists(DATABASE_DIRECTORY + "ratings.cxsdb")
                      ? "OK" : "ERROR")
                  << "] ratings.cxsdb\n";

        std::cout << "["
                  << (fs::exists(DATABASE_DIRECTORY + "puzzles.cxsdb")
                      ? "OK" : "ERROR")
                  << "] puzzles.cxsdb\n";

        std::cout << "["
                  << (fs::exists(DATABASE_DIRECTORY + "chats.cxsdb")
                      ? "OK" : "ERROR")
                  << "] chats.cxsdb\n";

        std::cout << "\nCXSDB READY.\n";
    }
};


int main() {

    CXSDB database;

    if (!database.initialize()) {

        std::cerr
            << "CXSDB ERROR: "
            << "Database initialization failed.\n";

        return 1;
    }

    database.status();

    return 0;
}
