#include "CXSDB_auth.hpp"
#include "CXSDB.hpp"

#include <fstream>
#include <filesystem>
#include <cstring>

namespace fs = std::filesystem;

namespace CXSDBAuth {

    static const std::string USERS_FILE =
        std::string(CXSDB::DATABASE_DIRECTORY) + "users.cxsdb";

    static const std::string STORAGE_FILE =
        std::string(CXSDB::DATABASE_DIRECTORY) + "storage.cxsdb";


    uint64_t hashPassword(
        const std::string& password
    ) {

        uint64_t hash =
            1469598103934665603ULL;

        for (unsigned char character : password) {

            hash ^= character;

            hash *=
                1099511628211ULL;
        }

        return hash;
    }


    bool usernameExists(
        const std::string& username
    ) {

        std::ifstream file(
            USERS_FILE,
            std::ios::binary
        );

        if (!file)
            return false;


        CXSDB::DatabaseHeader header{};

        file.read(
            reinterpret_cast<char*>(&header),
            sizeof(header)
        );

        if (!file)
            return false;


        if (
            std::memcmp(
                header.signature,
                "CXSDB",
                5
            ) != 0
        )
            return false;


        CXSDB::UserRecord user{};

        while (
            file.read(
                reinterpret_cast<char*>(&user),
                sizeof(user)
            )
        ) {

            if (
                std::string(user.username)
                == username
            )
                return true;
        }


        return false;
    }


    uint64_t getNextUserID() {

        std::ifstream file(
            USERS_FILE,
            std::ios::binary
        );

        if (!file)
            return 1;


        CXSDB::DatabaseHeader header{};

        file.read(
            reinterpret_cast<char*>(&header),
            sizeof(header)
        );


        uint64_t highestID = 0;

        CXSDB::UserRecord user{};


        while (
            file.read(
                reinterpret_cast<char*>(&user),
                sizeof(user)
            )
        ) {

            if (
                user.user_id >
                highestID
            )
                highestID = user.user_id;
        }


        return highestID + 1;
    }


    static bool addStorageRecord(
        uint64_t userID
    ) {

        std::ofstream file(
            STORAGE_FILE,
            std::ios::binary |
            std::ios::app
        );

        if (!file)
            return false;


        CXSDB::StorageRecord record{};

        record.user_id =
            userID;

        record.bytes_used =
            0;


        file.write(
            reinterpret_cast<const char*>(&record),
            sizeof(record)
        );


        return static_cast<bool>(file);
    }


    bool createUser(
        const std::string& username,
        const std::string& password
    ) {

        if (username.empty())
            return false;

        if (password.empty())
            return false;

        if (username.size() >= 32)
            return false;

        if (usernameExists(username))
            return false;


        uint64_t userID =
            getNextUserID();


        CXSDB::UserRecord user{};

        user.user_id =
            userID;


        std::strncpy(
            user.username,
            username.c_str(),
            sizeof(user.username) - 1
        );

        user.username[
            sizeof(user.username) - 1
        ] = '\0';


        user.password_hash =
            hashPassword(password);


        std::ofstream file(
            USERS_FILE,
            std::ios::binary |
            std::ios::app
        );

        if (!file)
            return false;


        file.write(
            reinterpret_cast<const char*>(&user),
            sizeof(user)
        );


        if (!file)
            return false;


        if (!addStorageRecord(userID))
            return false;


        return true;
    }


    bool ensureROOT() {

        if (
            usernameExists("ROOT.CSX")
        )
            return true;


        return false;
    }


    bool login(
        const std::string& username,
        const std::string& password
    ) {

        std::ifstream file(
            USERS_FILE,
            std::ios::binary
        );

        if (!file)
            return false;


        CXSDB::DatabaseHeader header{};

        file.read(
            reinterpret_cast<char*>(&header),
            sizeof(header)
        );

        if (!file)
            return false;


        if (
            std::memcmp(
                header.signature,
                "CXSDB",
                5
            ) != 0
        )
            return false;


        uint64_t passwordHash =
            hashPassword(password);


        CXSDB::UserRecord user{};


        while (
            file.read(
                reinterpret_cast<char*>(&user),
                sizeof(user)
            )
        ) {

            if (
                std::string(user.username)
                == username
                &&
                user.password_hash
                == passwordHash
            ) {

                return true;
            }
        }


        return false;
    }


    void signUp() {
        // Website/server handles signup.
    }

}