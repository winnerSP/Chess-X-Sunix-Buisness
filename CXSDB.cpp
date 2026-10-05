#include "CXSDB.hpp"

#include <iostream>
#include <fstream>
#include <filesystem>

namespace fs = std::filesystem;


bool CXSDB::databaseExists(
    const std::string& filename
) {
    return fs::exists(
        std::string(DATABASE_DIRECTORY) + filename
    );
}


bool CXSDB::createDatabase(
    const std::string& filename
) {
    std::ofstream file(
        std::string(DATABASE_DIRECTORY) + filename,
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

    return true;
}


bool CXSDB::initialize() {

    fs::create_directories(
        DATABASE_DIRECTORY
    );

    const std::string databases[] = {
        "users.cxsdb",
        "games.cxsdb",
        "ratings.cxsdb",
        "puzzles.cxsdb",
        "chats.cxsdb",
        "storage.cxsdb"
    };

    for (const std::string& database : databases) {

        if (!databaseExists(database)) {

            if (!createDatabase(database))
                return false;
        }
    }

    return true;
}