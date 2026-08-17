import {
    computed,
    createUserId,
    Tldraw,
    UserRecordType,
} from "tldraw";

import { useMemo } from "react";
import { useAppSelector } from "../../redux/hooks";

import { useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";

import { getCollaboratorColor } from "./collaboratorColors";

const Whiteboard = ({ roomId }) => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const users = useMemo(() => {
        const currentUser = computed(
            "currentUser",
            () =>
                UserRecordType.create({
                    id: createUserId(
                        user?._id?.toString() ||
                            "anonymous"
                    ),
                    name:
                        user?.name ||
                        "Anonymous",
                    color: getCollaboratorColor(
                        user?._id
                    ),
                })
        );

        return {
            currentUser,
        };
    }, [user?._id, user?.name]);

    const store = useSyncDemo({
        roomId: `studysync-${roomId}`,
        users,
    });

    return (
        <div className="h-full w-full">
            <Tldraw
                store={store}
                users={users}
            />
        </div>
    );
};

export default Whiteboard;