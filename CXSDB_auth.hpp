#ifndef CXSDB_AUTH_HPP
#define CXSDB_AUTH_HPP

#include <cstdint>
#include <string>

namespace CXSDBAuth {

    // ========================================
    // PASSWORD
    // ========================================

    uint64_t hashPassword(
        const std::string& password
    );


    // ========================================
    // USER LOOKUP
    // ========================================

    bool usernameExists(
        const std::string& username
    );

    uint64_t getNextUserID();


    // ========================================
    // ACCOUNT CREATION
    // ========================================

    bool createUser(
        const std::string& username,
        const std::string& password
    );


    // ========================================
    // ROOT
    // ========================================

    bool ensureROOT();


    // ========================================
    // LOGIN
    // ========================================

    bool login(
        const std::string& username,
        const std::string& password
    );


    // Returns the user ID of an authenticated
    // account, or 0 if authentication fails.
    uint64_t authenticate(
        const std::string& username,
        const std::string& password
    );


    // Find a user's ID from their username.
    // Returns 0 if the username does not exist.
    uint64_t getUserID(
        const std::string& username
    );


    // ========================================
    // USERNAME RULES
    // ========================================

    // Returns false if the username is reserved
    // or otherwise invalid.
    bool isUsernameAllowed(
        const std::string& username
    );


    // ========================================
    // CLI
    // ========================================

    void signUp();

}

#endif