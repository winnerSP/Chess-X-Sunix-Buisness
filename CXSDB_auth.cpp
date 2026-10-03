#include <iostream>
#include <fstream>
#include <filesystem>
#include <string>
#include <cstdint>
#include <limits>

namespace fs = std::filesystem;

class CXSDB_Auth {

private:

    const std::string DATABASE_DIRECTORY = "database/";

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

    // Prototype password hashing.
    // This is NOT intended as production-grade password security.
    uint64_t hashPassword(const std::string& password) {

        uint64_t hash = 1469598103934665603ULL;

        for (unsigned char character : password) {

            hash ^= character;

            hash *= 1099511628211ULL;
        }

        return hash;
    }

    bool createFileIfMissing(const std::string& filename) {

        std::string path =
            DATABASE_DIRECTORY + filename;

        if (fs::exists(path))
            return true;

        std::ofstream file(
            path,
            std::ios::binary
        );

        if (!file)
            return false;

        DatabaseHeader header = {
            {'C', 'X', 'S', 'D', 'B'},
            1
        };

        file.write(
            reinterpret_cast<const char*>(&header),
            sizeof(header)
        );

        return true;
    }

    bool initializeDatabase() {

        try {

            fs::create_directories(
                DATABASE_DIRECTORY
            );

        }
        catch (...) {

            return false;
        }

        return
            createFileIfMissing("users.cxsdb") &&
            createFileIfMissing("storage.cxsdb");
    }

    bool usernameExists(
        const std::string& username
    ) {

        std::ifstream file(
            DATABASE_DIRECTORY + "users.cxsdb",
            std::ios::binary
        );

        if (!file)
            return false;

        DatabaseHeader header{};

        file.read(
            reinterpret_cast<char*>(&header),
            sizeof(header)
        );

        UserRecord user{};

        while (
            file.read(
                reinterpret_cast<char*>(&user),
                sizeof(UserRecord)
            )
        ) {

            std::string storedUsername(
                user.username
            );

            if (storedUsername == username)
                return true;
        }

        return false;
    }

    uint64_t getNextUserID() {

        std::ifstream file(
            DATABASE_DIRECTORY + "users.cxsdb",
            std::ios::binary
        );

        if (!file)
            return 1;

        DatabaseHeader header{};

        file.read(
            reinterpret_cast<char*>(&header),
            sizeof(header)
        );

        uint64_t highestID = 0;

        UserRecord user{};

        while (
            file.read(
                reinterpret_cast<char*>(&user),
                sizeof(UserRecord)
            )
        ) {

            if (user.user_id > highestID)
                highestID = user.user_id;
        }

        return highestID + 1;
    }

    bool addStorageRecord(
        uint64_t userID,
        uint64_t bytes
    ) {

        std::fstream file(
            DATABASE_DIRECTORY + "storage.cxsdb",
            std::ios::binary |
            std::ios::in |
            std::ios::out
        );

        if (!file)
            return false;

        DatabaseHeader header{};

        file.read(
            reinterpret_cast<char*>(&header),
            sizeof(header)
        );

        StorageRecord record{};

        std::streampos recordPosition;

        while (true) {

            recordPosition = file.tellg();

            if (!file.read(
                    reinterpret_cast<char*>(&record),
                    sizeof(StorageRecord)
                ))
                break;

            if (record.user_id == userID) {

                record.bytes_used += bytes;

                file.clear();

                file.seekp(recordPosition);

                file.write(
                    reinterpret_cast<const char*>(&record),
                    sizeof(StorageRecord)
                );

                return true;
            }
        }

        record.user_id = userID;
        record.bytes_used = bytes;

        file.clear();

        file.seekp(0, std::ios::end);

        file.write(
            reinterpret_cast<const char*>(&record),
            sizeof(StorageRecord)
        );

        return true;
    }

    bool createUser(
        const std::string& username,
        const std::string& password
    ) {

        if (username.empty() || password.empty())
            return false;

        if (username.size() >= 32)
            return false;

        if (usernameExists(username))
            return false;

        uint64_t userID = getNextUserID();

        UserRecord user{};

        user.user_id = userID;

        for (size_t i = 0;
             i < username.size();
             i++) {

            user.username[i] = username[i];
        }

        user.username[username.size()] = '\0';

        user.password_hash =
            hashPassword(password);

        std::ofstream file(
            DATABASE_DIRECTORY + "users.cxsdb",
            std::ios::binary |
            std::ios::app
        );

        if (!file)
            return false;

        file.write(
            reinterpret_cast<const char*>(&user),
            sizeof(UserRecord)
        );

        file.close();

        // Initial account storage record.
        if (!addStorageRecord(userID, sizeof(UserRecord)))
            return false;

        return true;
    }

    bool ensureROOT() {

        if (usernameExists("ROOT.CSX"))
            return true;

        std::cout << "\n";
        std::cout << "================================\n";
        std::cout << "       ROOT.CSX SETUP\n";
        std::cout << "================================\n\n";

        std::cout
            << "ROOT.CSX does not exist.\n";

        std::cout
            << "Create the ROOT password:\n> ";

        std::string password;

        std::getline(
            std::cin,
            password
        );

        if (password.empty()) {

            std::cout
                << "ERROR: Password cannot be empty.\n";

            return false;
        }

        if (!createUser(
                "ROOT.CSX",
                password
            )) {

            std::cout
                << "ERROR: Could not create ROOT.CSX.\n";

            return false;
        }

        std::cout
            << "\nROOT.CSX CREATED.\n";

        return true;
    }

    bool login() {

        std::string username;
        std::string password;

        std::cout << "\n";
        std::cout << "========== LOGIN ==========\n";

        std::cout << "Username: ";

        std::getline(
            std::cin,
            username
        );

        std::cout << "Password: ";

        std::getline(
            std::cin,
            password
        );

        std::ifstream file(
            DATABASE_DIRECTORY + "users.cxsdb",
            std::ios::binary
        );

        if (!file) {

            std::cout
                << "ERROR: User database unavailable.\n";

            return false;
        }

        DatabaseHeader header{};

        file.read(
            reinterpret_cast<char*>(&header),
            sizeof(header)
        );

        UserRecord user{};

        uint64_t passwordHash =
            hashPassword(password);

        while (
            file.read(
                reinterpret_cast<char*>(&user),
                sizeof(UserRecord)
            )
        ) {

            std::string storedUsername(
                user.username
            );

            if (
                storedUsername == username &&
                user.password_hash == passwordHash
            ) {

                std::cout << "\n";
                std::cout
                    << "LOGIN SUCCESSFUL!\n";

                std::cout
                    << "User ID : "
                    << user.user_id
                    << "\n";

                std::cout
                    << "Account : "
                    << user.username
                    << "\n";

                return true;
            }
        }

        std::cout << "\n";
        std::cout
            << "LOGIN FAILED.\n";

        std::cout
            << "Invalid username or password.\n";

        return false;
    }

    bool signUp() {

        std::string username;
        std::string password;
        std::string confirmation;

        std::cout << "\n";
        std::cout << "========= SIGN UP =========\n";

        std::cout << "Username: ";

        std::getline(
            std::cin,
            username
        );

        if (username == "ROOT.CSX") {

            std::cout
                << "That username is reserved.\n";

            return false;
        }

        std::cout << "Password: ";

        std::getline(
            std::cin,
            password
        );

        std::cout
            << "Confirm password: ";

        std::getline(
            std::cin,
            confirmation
        );

        if (password != confirmation) {

            std::cout
                << "Passwords do not match.\n";

            return false;
        }

        if (username.size() >= 32) {

            std::cout
                << "Username is too long.\n";

            return false;
        }

        if (createUser(
                username,
                password
            )) {

            std::cout << "\n";
            std::cout
                << "ACCOUNT CREATED!\n";

            std::cout
                << "Username: "
                << username
                << "\n";

            return true;
        }

        std::cout
            << "ERROR: Username may already exist "
            << "or the database could not be written.\n";

        return false;
    }

public:

    void run() {

        if (!initializeDatabase()) {

            std::cout
                << "CXSDB ERROR: "
                << "Could not initialize database.\n";

            return;
        }

        // Create ROOT.CSX if this is the first run.
        if (!ensureROOT())
            return;

        while (true) {

            std::cout << "\n";
            std::cout
                << "============================\n";
            std::cout
                << "       CXSDB AUTH\n";
            std::cout
                << "============================\n";

            std::cout
                << "1. Login\n";
            std::cout
                << "2. Sign Up\n";
            std::cout
                << "3. Exit\n";

            std::cout
                << "\nSelect: ";

            int choice;

            if (!(std::cin >> choice)) {

                std::cin.clear();

                std::cin.ignore(
                    std::numeric_limits<
                        std::streamsize
                    >::max(),
                    '\n'
                );

                std::cout
                    << "Invalid selection.\n";

                continue;
            }

            std::cin.ignore(
                std::numeric_limits<
                    std::streamsize
                >::max(),
                '\n'
            );

            if (choice == 1) {

                login();
            }
            else if (choice == 2) {

                signUp();
            }
            else if (choice == 3) {

                std::cout
                    << "CXSDB AUTH CLOSED.\n";

                break;
            }
            else {

                std::cout
                    << "Invalid selection.\n";
            }
        }
    }
};


int main() {

    CXSDB_Auth auth;

    auth.run();

    return 0;
}
