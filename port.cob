       IDENTIFICATION DIVISION.
       PROGRAM-ID. CXSDB-PORT-MANAGER.

       ENVIRONMENT DIVISION.

       DATA DIVISION.

       WORKING-STORAGE SECTION.

       01 PRIMARY-PORT       PIC 9(4) VALUE 8081.
       01 BACKUP-PORT        PIC 9(4) VALUE 8082.
       01 SELECTED-PORT      PIC 9(4) VALUE 0.
       01 PORT-STATUS        PIC X VALUE "N".

       01 PORT-FILE-NAME     PIC X(17)
          VALUE "selected_port.txt".

       01 PORT-TEXT          PIC X(4).

       PROCEDURE DIVISION.

       MAIN-PROCEDURE.

           DISPLAY "================================".
           DISPLAY "       CXSDB PORT MANAGER".
           DISPLAY "================================".
           DISPLAY "Primary Port: " PRIMARY-PORT.
           DISPLAY "Backup Port : " BACKUP-PORT.
           DISPLAY "".

           MOVE "N" TO PORT-STATUS.

           DISPLAY "Checking primary port...".

           CALL "SYSTEM"
               USING
               "ss -ltn | grep ':8081 ' > /dev/null 2>&1".

           IF RETURN-CODE = 0
               DISPLAY "Primary port 8081 is in use."
               DISPLAY "Checking backup port..."
           ELSE
               MOVE "Y" TO PORT-STATUS
           END-IF.

           IF PORT-STATUS = "Y"

               MOVE PRIMARY-PORT TO SELECTED-PORT

           ELSE

               CALL "SYSTEM"
                   USING
                   "ss -ltn | grep ':8082 ' > /dev/null 2>&1"

               IF RETURN-CODE = 0

                   DISPLAY "Backup port 8082 is also in use."
                   DISPLAY "No available port found."

               ELSE

                   MOVE BACKUP-PORT TO SELECTED-PORT

               END-IF

           END-IF.

           IF SELECTED-PORT = 0

               DISPLAY "".
               DISPLAY "CXSDB PORT MANAGER ERROR."
               DISPLAY "Could not select a port."

               MOVE 1 TO RETURN-CODE
               STOP RUN

           END-IF.

           DISPLAY "".
           DISPLAY "Selected Port: " SELECTED-PORT.

           MOVE SELECTED-PORT TO PORT-TEXT.

           OPEN OUTPUT PORT-FILE-NAME.

           WRITE PORT-TEXT.

           CLOSE PORT-FILE-NAME.

           DISPLAY "Port saved to selected_port.txt".
           DISPLAY "".
           DISPLAY "CXSDB PORT MANAGER READY.".

           MOVE 0 TO RETURN-CODE.

           STOP RUN.
           