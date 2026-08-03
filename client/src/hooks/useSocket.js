import { useEffect } from "react";
import socket from "../socket/socket";

const useSocket = () => {
    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.disconnect();
        };
    }, []);

    return socket;
};

export default useSocket;