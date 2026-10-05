#include "CXSDB.hpp"
#include "CXSDB_auth.hpp"

#include <arpa/inet.h>
#include <cstring>
#include <iostream>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>

#include <string>

constexpr int PORT = 8080;
constexpr int BUFFER_SIZE = 8192;


// ========================================
// SEND HTTP RESPONSE
// ========================================

void sendResponse(
    int client,
    int statusCode,
    const std::string& statusText,
    const std::string& body
) {
    std::string response =
        "HTTP/1.1 " +
        std::to_string(statusCode) +
        " " +
        statusText +
        "\r\n"
        "Content-Type: application/json\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "Access-Control-Allow-Methods: POST, OPTIONS\r\n"
        "Access-Control-Allow-Headers: Content-Type\r\n"
        "Content-Length: " +
        std::to_string(body.size()) +
        "\r\n"
        "Connection: close\r\n"
        "\r\n" +
        body;

    send(
        client,
        response.c_str(),
        response.size(),
        0
    );
}


// ========================================
// SIMPLE JSON VALUE READER
// ========================================

std::string getJsonValue(
    const std::string& json,
    const std::string& key
) {
    std::string search =
        "\"" + key + "\"";

    size_t keyPosition =
        json.find(search);

    if (keyPosition == std::string::npos)
        return "";

    size_t colon =
        json.find(
            ':',
            keyPosition + search.size()
        );

    if (colon == std::string::npos)
        return "";

    size_t firstQuote =
        json.find(
            '"',
            colon + 1
        );

    if (firstQuote == std::string::npos)
        return "";

    size_t secondQuote =
        json.find(
            '"',
            firstQuote + 1
        );

    if (secondQuote == std::string::npos)
        return "";

    return json.substr(
        firstQuote + 1,
        secondQuote - firstQuote - 1
    );
}


// ========================================
// LOGIN
// ========================================

void handleLogin(
    int client,
    const std::string& body
) {
    std::string username =
        getJsonValue(
            body,
            "username"
        );

    std::string password =
        getJsonValue(
            body,
            "password"
        );

    if (
        username.empty() ||
        password.empty()
    ) {
        sendResponse(
            client,
            400,
            "Bad Request",
            R"({"success":false,"message":"Missing login information."})"
        );

        return;
    }

    bool authenticated =
        CXSDBAuth::login(
            username,
            password
        );

    if (authenticated) {

        sendResponse(
            client,
            200,
            "OK",
            R"({"success":true,"message":"Login successful."})"
        );
    }
    else {

        sendResponse(
            client,
            401,
            "Unauthorized",
            R"({"success":false,"message":"Invalid username or password."})"
        );
    }
}


// ========================================
// SIGNUP
// ========================================

void handleSignup(
    int client,
    const std::string& body
) {
    std::string username =
        getJsonValue(
            body,
            "username"
        );

    std::string password =
        getJsonValue(
            body,
            "password"
        );

    std::string termsAccepted =
        getJsonValue(
            body,
            "termsAccepted"
        );

    if (
        username.empty() ||
        password.empty()
    ) {
        sendResponse(
            client,
            400,
            "Bad Request",
            R"({"success":false,"message":"Missing account information."})"
        );

        return;
    }

    if (termsAccepted != "true") {

        sendResponse(
            client,
            400,
            "Bad Request",
            R"({"success":false,"message":"Terms and Conditions must be accepted."})"
        );

        return;
    }

    bool created =
        CXSDBAuth::createUser(
            username,
            password
        );

    if (created) {

        sendResponse(
            client,
            201,
            "Created",
            R"({"success":true,"message":"Account created successfully."})"
        );
    }
    else {

        sendResponse(
            client,
            409,
            "Conflict",
            R"({"success":false,"message":"Could not create account. Username may already exist."})"
        );
    }
}


// ========================================
// HANDLE CLIENT
// ========================================

void handleClient(
    int client
) {
    char buffer[BUFFER_SIZE];

    std::memset(
        buffer,
        0,
        sizeof(buffer)
    );

    ssize_t received =
        recv(
            client,
            buffer,
            sizeof(buffer) - 1,
            0
        );

    if (received <= 0)
        return;

    std::string request(
        buffer,
        received
    );


    size_t firstLineEnd =
        request.find("\r\n");

    if (
        firstLineEnd ==
        std::string::npos
    ) {
        sendResponse(
            client,
            400,
            "Bad Request",
            R"({"success":false,"message":"Invalid HTTP request."})"
        );

        return;
    }


    std::string requestLine =
        request.substr(
            0,
            firstLineEnd
        );


    size_t firstSpace =
        requestLine.find(' ');

    size_t secondSpace =
        requestLine.find(
            ' ',
            firstSpace + 1
        );


    if (
        firstSpace ==
            std::string::npos ||
        secondSpace ==
            std::string::npos
    ) {
        sendResponse(
            client,
            400,
            "Bad Request",
            R"({"success":false,"message":"Invalid HTTP request."})"
        );

        return;
    }


    std::string method =
        requestLine.substr(
            0,
            firstSpace
        );


    std::string path =
        requestLine.substr(
            firstSpace + 1,
            secondSpace -
                firstSpace - 1
        );


    // ====================================
    // CORS PREFLIGHT
    // ====================================

    if (method == "OPTIONS") {

        sendResponse(
            client,
            204,
            "No Content",
            ""
        );

        return;
    }


    if (method != "POST") {

        sendResponse(
            client,
            405,
            "Method Not Allowed",
            R"({"success":false,"message":"POST required."})"
        );

        return;
    }


    size_t headerEnd =
        request.find("\r\n\r\n");

    if (
        headerEnd ==
        std::string::npos
    ) {
        sendResponse(
            client,
            400,
            "Bad Request",
            R"({"success":false,"message":"Invalid request body."})"
        );

        return;
    }


    std::string body =
        request.substr(
            headerEnd + 4
        );


    if (path == "/login") {

        handleLogin(
            client,
            body
        );
    }

    else if (path == "/signup") {

        handleSignup(
            client,
            body
        );
    }

    else {

        sendResponse(
            client,
            404,
            "Not Found",
            R"({"success":false,"message":"Endpoint not found."})"
        );
    }
}


// ========================================
// SERVER
// ========================================

int main() {

    if (!CXSDB::initialize()) {

        std::cerr
            << "CXSDB ERROR: Initialization failed.\n";

        return 1;
    }


    int serverSocket =
        socket(
            AF_INET,
            SOCK_STREAM,
            0
        );


    if (serverSocket < 0) {

        std::cerr
            << "SERVER ERROR: Could not create socket.\n";

        return 1;
    }


    int reuse = 1;

    setsockopt(
        serverSocket,
        SOL_SOCKET,
        SO_REUSEADDR,
        &reuse,
        sizeof(reuse)
    );


    sockaddr_in serverAddress{};

    serverAddress.sin_family =
        AF_INET;

    serverAddress.sin_addr.s_addr =
        INADDR_ANY;

    serverAddress.sin_port =
        htons(PORT);


    if (
        bind(
            serverSocket,
            reinterpret_cast<sockaddr*>(
                &serverAddress
            ),
            sizeof(serverAddress)
        ) < 0
    ) {

        std::cerr
            << "SERVER ERROR: Could not bind port "
            << PORT
            << ".\n";

        close(serverSocket);

        return 1;
    }


    if (
        listen(
            serverSocket,
            10
        ) < 0
    ) {

        std::cerr
            << "SERVER ERROR: Could not start listening.\n";

        close(serverSocket);

        return 1;
    }


    std::cout
        << "\n================================\n"
        << "       CXSDB SERVER ONLINE\n"
        << "================================\n"
        << "Port: "
        << PORT
        << "\n\n";


    while (true) {

        sockaddr_in clientAddress{};

        socklen_t clientLength =
            sizeof(clientAddress);


        int client =
            accept(
                serverSocket,
                reinterpret_cast<sockaddr*>(
                    &clientAddress
                ),
                &clientLength
            );


        if (client < 0)
            continue;


        handleClient(client);

        close(client);
    }


    close(serverSocket);

    return 0;
}