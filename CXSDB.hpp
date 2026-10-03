#ifndef CXSDB_HPP
#define CXSDB_HPP

#include <cstdint>
#include <string>

class CXSDB {

public:

    static constexpr uint8_t VERSION = 1;

    static constexpr const char* DATABASE_DIRECTORY =
        "database/";

    struct DatabaseHeader {
        char signature[5];
        uint8_t version;
    };

    struct UserRecord {
        uint64_t user_id;
        char username[32];
        uint64_t password_hash;
    };

    struct StorageRecord {
        uint64_t user_id;
        uint64_t bytes_used;
    };

    static bool initialize();

    static bool createDatabase(
        const std::string& filename
    );

    static bool databaseExists(
        const std::string& filename
    );
};

#endif
