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

    struct StorageRecord {
        uint64_t user_id;
        uint64_t bytes_used;
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

        // Storage database
        if (!fs::exists(DATABASE_DIRECTORY + "storage.cxsdb")) {

            std::ofstream file(
                DATABASE_DIRECTORY + "storage.cxsdb",
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
        }

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

        const std::string files[] = {
            "users.cxsdb",
            "games.cxsdb",
            "ratings.cxsdb",
            "puzzles.cxsdb",
            "chats.cxsdb",
            "storage.cxsdb"
        };

        for (const std::string& filename : files) {

            std::cout << "["
                      << (fs::exists(
                              DATABASE_DIRECTORY + filename
                          )
                          ? "OK" : "ERROR")
                      << "] "
                      << filename
                      << "\n";
        }

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
