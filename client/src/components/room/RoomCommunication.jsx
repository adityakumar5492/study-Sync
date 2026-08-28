import { useState } from "react";

import {
    FaUsers,
    FaComments,
    FaMicrophone,
    FaPen,
} from "react-icons/fa";

import Participants from "./Participants";
import ChatPanel from "./ChatPanel";
import VoicePanel from "./voice/VoicePanel";

const RoomCommunication = ({
    room,
    roomId,
    currentUser,
    onlineUsers,
    isHost,
    isMember,
    onRemoveMember,

    // Drawing permission
    drawingPermission,
    onDrawingPermissionChange,
}) => {
    const [activePanel, setActivePanel] =
        useState("participants");

    // Mobile bottom-sheet state
    const [mobilePanelOpen, setMobilePanelOpen] =
        useState(false);

    // ===========================
    // Normalize User ID
    // ===========================

    const getUserId = (user) => {
        if (!user) {
            return null;
        }

        if (typeof user === "string") {
            return user;
        }

        if (typeof user === "object") {
            return (
                user._id?.toString() ||
                user.id?.toString() ||
                user.userId?.toString() ||
                null
            );
        }

        return user?.toString() || null;
    };

    // ===========================
    // Unique Room Members
    // ===========================

    const uniqueMembers = Array.from(
        new Map(
            (room?.members || [])
                .map((member) => {
                    const userId =
                        getUserId(member);

                    if (!userId) {
                        return null;
                    }

                    return [
                        userId,
                        member,
                    ];
                })
                .filter(Boolean)
        ).values()
    );

    // ===========================
    // Unique Online Users
    //
    // A user may reconnect/rejoin
    // multiple times. Presence must
    // represent unique users, not
    // socket connections.
    // ===========================

    const uniqueOnlineUsers = Array.from(
        new Map(
            (onlineUsers || [])
                .map((onlineUser) => {
                    const userId =
                        getUserId(onlineUser);

                    if (!userId) {
                        return null;
                    }

                    return [
                        userId,
                        onlineUser,
                    ];
                })
                .filter(Boolean)
        ).values()
    );

    // ===========================
    // Participant Counts
    // ===========================

    const participantsCount =
        uniqueMembers.length;

    const onlineCount =
        uniqueOnlineUsers.length;

    // ===========================
    // Check Current User
    // ===========================

    const currentUserId =
        currentUser?._id?.toString();

    const canDraw =
        isHost ||
        drawingPermission?.mode === "everyone" ||
        (
            drawingPermission?.mode ===
                "selected" &&
            drawingPermission?.allowedUsers?.includes(
                currentUserId
            )
        );

    // ===========================
    // Communication Tab Handler
    // ===========================

    const handlePanelChange = (panel) => {
        setActivePanel(panel);

        // Mobile:
        // Clicking the currently open tab closes
        // the bottom sheet. Clicking another tab
        // switches the panel and keeps it open.
        if (
            typeof window !== "undefined" &&
            window.innerWidth < 1024
        ) {
            if (
                activePanel === panel &&
                mobilePanelOpen
            ) {
                setMobilePanelOpen(false);
            } else {
                setMobilePanelOpen(true);
            }
        }
    };

    return (
        <div
            className="
                relative
                flex
                h-full
                min-h-0
                min-w-0
                flex-col
                overflow-hidden
                bg-slate-950
            "
        >
            {/* ===========================
                Communication Tabs
            =========================== */}

            <div
                className="
                    order-last
                    z-50
                    grid
                    shrink-0
                    grid-cols-4
                    gap-px
                    border-t
                    border-slate-800/80
                    bg-slate-950/98
                    px-0.5
                    py-0.5
                    shadow-[0_-10px_30px_rgba(0,0,0,0.35)]
                    backdrop-blur-xl

                    lg:order-none
                    lg:z-auto
                    lg:border-t-0
                    lg:border-b
                    lg:bg-slate-900/95
                    lg:shadow-lg
                    lg:shadow-black/10
                    lg:backdrop-blur-none
                "
            >
                {/* =================================
                    PARTICIPANTS
                ================================= */}

                <button
                    type="button"
                    onClick={() =>
                        handlePanelChange(
                            "participants"
                        )
                    }
                    className={`
                        flex
                        min-w-0
                        items-center
                        justify-center
                        gap-1
                        overflow-hidden
                        rounded-t-lg
                        px-1
                        py-2.5
                        text-[10px]
                        font-semibold
                        transition-colors

                        sm:gap-1.5
                        sm:px-1.5
                        sm:py-3
                        sm:text-[11px]

                        ${
                            activePanel ===
                                "participants" &&
                            (
                                mobilePanelOpen ||
                                typeof window ===
                                    "undefined" ||
                                window.innerWidth >=
                                    1024
                            )
                                ? "bg-slate-800 text-green-400 shadow-sm"
                                : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                        }
                    `}
                    title={`Participants (${participantsCount})`}
                >
                    <FaUsers
                        className="
                            shrink-0
                            text-[10px]
                            sm:text-[11px]
                        "
                    />

                    <span className="min-w-0 truncate">
                        Participants
                    </span>

                    <span
                        className={`
                            shrink-0
                            rounded-full
                            px-1.5
                            py-0.5
                            text-[8px]
                            font-bold
                            leading-none

                            ${
                                activePanel ===
                                    "participants" &&
                                (
                                    mobilePanelOpen ||
                                    typeof window ===
                                        "undefined" ||
                                    window.innerWidth >=
                                        1024
                                )
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-slate-800 text-slate-500"
                            }
                        `}
                    >
                        {participantsCount}
                    </span>
                </button>

                {/* =================================
                    CHAT
                ================================= */}

                <button
                    type="button"
                    onClick={() =>
                        handlePanelChange("chat")
                    }
                    className={`
                        flex
                        min-w-0
                        items-center
                        justify-center
                        gap-1.5
                        overflow-hidden
                        rounded-t-lg
                        px-1
                        py-2.5
                        text-[10px]
                        font-semibold
                        transition-colors

                        sm:px-1.5
                        sm:py-3
                        sm:text-[11px]

                        ${
                            activePanel === "chat" &&
                            (
                                mobilePanelOpen ||
                                typeof window ===
                                    "undefined" ||
                                window.innerWidth >=
                                    1024
                            )
                                ? "bg-slate-800 text-green-400 shadow-sm"
                                : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                        }
                    `}
                    title="Chat"
                >
                    <FaComments
                        className="
                            shrink-0
                            text-[10px]
                            sm:text-[11px]
                        "
                    />

                    <span className="truncate">
                        Chat
                    </span>
                </button>

                {/* =================================
                    VOICE
                ================================= */}

                <button
                    type="button"
                    onClick={() =>
                        handlePanelChange("voice")
                    }
                    className={`
                        flex
                        min-w-0
                        items-center
                        justify-center
                        gap-1.5
                        overflow-hidden
                        rounded-t-lg
                        px-1
                        py-2.5
                        text-[10px]
                        font-semibold
                        transition-colors

                        sm:px-1.5
                        sm:py-3
                        sm:text-[11px]

                        ${
                            activePanel === "voice" &&
                            (
                                mobilePanelOpen ||
                                typeof window ===
                                    "undefined" ||
                                window.innerWidth >=
                                    1024
                            )
                                ? "bg-slate-800 text-green-400 shadow-sm"
                                : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                        }
                    `}
                    title="Voice"
                >
                    <FaMicrophone
                        className="
                            shrink-0
                            text-[10px]
                            sm:text-[11px]
                        "
                    />

                    <span className="truncate">
                        Voice
                    </span>
                </button>

                {/* =================================
                    DRAWING
                ================================= */}

                <button
                    type="button"
                    onClick={() =>
                        handlePanelChange("drawing")
                    }
                    className={`
                        flex
                        min-w-0
                        items-center
                        justify-center
                        gap-1.5
                        overflow-hidden
                        rounded-t-lg
                        px-1
                        py-2.5
                        text-[10px]
                        font-semibold
                        transition-colors

                        sm:px-1.5
                        sm:py-3
                        sm:text-[11px]

                        ${
                            activePanel ===
                                "drawing" &&
                            (
                                mobilePanelOpen ||
                                typeof window ===
                                    "undefined" ||
                                window.innerWidth >=
                                    1024
                            )
                                ? "bg-slate-800 text-green-400 shadow-sm"
                                : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                        }
                    `}
                    title="Drawing"
                >
                    <FaPen
                        className="
                            shrink-0
                            text-[9px]
                            sm:text-[10px]
                        "
                    />

                    <span className="truncate">
                        Drawing
                    </span>
                </button>
            </div>

            {/* ===========================
                Active Panel
            =========================== */}

            <div
                className={`
                    absolute
                    inset-x-0
                    bottom-[48px]
                    z-40
                    flex
                    max-h-[58vh]
                    min-h-0
                    min-w-0
                    flex-col
                    overflow-hidden
                    border-t
                    border-slate-700/70
                    bg-slate-900
                    shadow-[0_-20px_50px_rgba(0,0,0,0.55)]
                    transition-all
                    duration-300
                    ease-out

                    ${
                        mobilePanelOpen
                            ? "translate-y-0 opacity-100"
                            : "pointer-events-none translate-y-full opacity-0"
                    }

                    lg:static
                    lg:z-auto
                    lg:flex-1
                    lg:max-h-none
                    lg:translate-y-0
                    lg:opacity-100
                    lg:pointer-events-auto
                    lg:border-t-0
                    lg:bg-slate-900/70
                    lg:shadow-none
                `}
            >
                {/* =================================
                    Mobile Sheet Handle
                ================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-center
                        border-b
                        border-slate-800/70
                        py-1.5
                        lg:hidden
                    "
                >
                    <button
                        type="button"
                        onClick={() =>
                            setMobilePanelOpen(false)
                        }
                        className="
                            h-1
                            w-10
                            rounded-full
                            bg-slate-600
                            transition
                            hover:bg-slate-400
                        "
                        aria-label="Close communication panel"
                    />
                </div>

                {/* =================================
                    PARTICIPANTS
                ================================= */}

                {activePanel ===
                    "participants" && (
                    <div
                        className="
                            flex
                            h-full
                            min-h-0
                            min-w-0
                            flex-col
                        "
                    >
                        {/* Participant Summary */}

                        <div
                            className="
                                flex
                                shrink-0
                                items-center
                                justify-between
                                border-b
                                border-slate-800/70
                                px-3
                                py-2.5

                                sm:px-4
                                sm:py-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-2
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-7
                                        w-7
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-green-500/10
                                        text-green-400
                                    "
                                >
                                    <FaUsers className="text-[10px]" />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="
                                            truncate
                                            text-[10px]
                                            font-bold
                                            text-white
                                            sm:text-[11px]
                                        "
                                    >
                                        Live Participants
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            truncate
                                            text-[8px]
                                            text-slate-600
                                        "
                                    >
                                        {participantsCount}{" "}
                                        {participantsCount ===
                                        1
                                            ? "participant"
                                            : "participants"}
                                    </p>
                                </div>
                            </div>

                            <div
                                className="
                                    flex
                                    shrink-0
                                    items-center
                                    gap-1.5
                                    rounded-full
                                    border
                                    border-emerald-400/10
                                    bg-emerald-500/[0.06]
                                    px-2
                                    py-1
                                "
                            >
                                <span
                                    className="
                                        relative
                                        flex
                                        h-1.5
                                        w-1.5
                                    "
                                >
                                    <span
                                        className="
                                            absolute
                                            inset-0
                                            rounded-full
                                            bg-emerald-400
                                            opacity-40
                                        "
                                    />

                                    <span
                                        className="
                                            relative
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            bg-emerald-400
                                        "
                                    />
                                </span>

                                <span
                                    className="
                                        text-[8px]
                                        font-bold
                                        text-emerald-400
                                    "
                                >
                                    {onlineCount} online
                                </span>
                            </div>
                        </div>

                        {/* Actual Participants Component */}

                        <div
                            className="
                                min-h-0
                                min-w-0
                                flex-1
                                overflow-y-auto
                                overflow-x-hidden
                                overscroll-contain
                            "
                        >
                            <Participants
                                room={room}
                                roomId={roomId}
                                participants={
                                    uniqueMembers
                                }
                                onlineUsers={
                                    uniqueOnlineUsers
                                }
                                onRemoveMember={
                                    onRemoveMember
                                }
                            />
                        </div>
                    </div>
                )}

                {/* =================================
                    CHAT
                ================================= */}

                {activePanel === "chat" && (
                    <div
                        className="
                            flex
                            h-full
                            min-h-0
                            min-w-0
                            flex-1
                            flex-col
                            overflow-hidden
                        "
                    >
                        <ChatPanel
                            roomId={roomId}
                            isHost={isHost}
                            isMember={isMember}
                        />
                    </div>
                )}

                {/* =================================
                    VOICE
                ================================= */}

                {activePanel === "voice" && (
                    <div
                        className="
                            flex
                            h-full
                            min-h-0
                            min-w-0
                            flex-1
                            flex-col
                            overflow-hidden
                        "
                    >
                        <VoicePanel
                            roomId={roomId}
                            currentUser={currentUser}
                        />
                    </div>
                )}

                {/* =================================
                    DRAWING
                ================================= */}

                {activePanel === "drawing" && (
                    <div
                        className="
                            h-full
                            min-h-0
                            min-w-0
                            overflow-y-auto
                            overflow-x-hidden
                            p-2.5

                            sm:p-3
                            lg:p-4
                        "
                    >
                        {/* Drawing Header */}

                        <div
                            className="
                                mb-3
                                rounded-xl
                                border
                                border-slate-800/80
                                bg-slate-950/50
                                p-3
                                shadow-sm

                                sm:mb-4
                                sm:p-4
                            "
                        >
                            <h3
                                className="
                                    text-sm
                                    font-semibold
                                    tracking-tight
                                    text-white
                                    sm:text-base
                                "
                            >
                                Drawing Access
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    leading-4
                                    text-slate-500
                                    sm:text-xs
                                    sm:leading-5
                                "
                            >
                                Choose who can annotate
                                the PDF.
                            </p>
                        </div>

                        {/* ===========================
                            Host Controls
                        =========================== */}

                        {isHost && (
                            <div
                                className="
                                    space-y-1.5
                                    rounded-xl
                                    border
                                    border-slate-800/80
                                    bg-slate-950/40
                                    p-1.5

                                    sm:space-y-2
                                    sm:p-2
                                "
                            >
                                {/* Host Only */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDrawingPermissionChange(
                                            {
                                                mode: "none",
                                                allowedUsers:
                                                    [],
                                            }
                                        )
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-2.5
                                        rounded-lg
                                        border
                                        border-transparent
                                        px-2.5
                                        py-2
                                        text-left
                                        text-[11px]
                                        text-slate-300
                                        transition-colors
                                        hover:border-slate-700/70
                                        hover:bg-slate-800/80
                                        hover:text-white

                                        sm:gap-3
                                        sm:px-3
                                        sm:py-2.5
                                        sm:text-sm
                                    "
                                >
                                    <span
                                        className={`
                                            flex
                                            h-4
                                            w-4
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            border-2

                                            ${
                                                drawingPermission?.mode ===
                                                "none"
                                                    ? "border-green-500"
                                                    : "border-slate-600"
                                            }
                                        `}
                                    >
                                        {drawingPermission?.mode ===
                                            "none" && (
                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                        )}
                                    </span>

                                    <span className="truncate">
                                        Host Only
                                    </span>
                                </button>

                                {/* Everyone */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDrawingPermissionChange(
                                            {
                                                mode: "everyone",
                                                allowedUsers:
                                                    [],
                                            }
                                        )
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-2.5
                                        rounded-lg
                                        border
                                        border-transparent
                                        px-2.5
                                        py-2
                                        text-left
                                        text-[11px]
                                        text-slate-300
                                        transition-colors
                                        hover:border-slate-700/70
                                        hover:bg-slate-800/80
                                        hover:text-white

                                        sm:gap-3
                                        sm:px-3
                                        sm:py-2.5
                                        sm:text-sm
                                    "
                                >
                                    <span
                                        className={`
                                            flex
                                            h-4
                                            w-4
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            border-2

                                            ${
                                                drawingPermission?.mode ===
                                                "everyone"
                                                    ? "border-green-500"
                                                    : "border-slate-600"
                                            }
                                        `}
                                    >
                                        {drawingPermission?.mode ===
                                            "everyone" && (
                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                        )}
                                    </span>

                                    <span className="truncate">
                                        Everyone
                                    </span>
                                </button>

                                {/* Selected Users */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDrawingPermissionChange(
                                            {
                                                mode: "selected",
                                                allowedUsers:
                                                    drawingPermission?.allowedUsers ||
                                                    [],
                                            }
                                        )
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-2.5
                                        rounded-lg
                                        border
                                        border-transparent
                                        px-2.5
                                        py-2
                                        text-left
                                        text-[11px]
                                        text-slate-300
                                        transition-colors
                                        hover:border-slate-700/70
                                        hover:bg-slate-800/80
                                        hover:text-white

                                        sm:gap-3
                                        sm:px-3
                                        sm:py-2.5
                                        sm:text-sm
                                    "
                                >
                                    <span
                                        className={`
                                            flex
                                            h-4
                                            w-4
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            border-2

                                            ${
                                                drawingPermission?.mode ===
                                                "selected"
                                                    ? "border-green-500"
                                                    : "border-slate-600"
                                            }
                                        `}
                                    >
                                        {drawingPermission?.mode ===
                                            "selected" && (
                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                        )}
                                    </span>

                                    <span className="truncate">
                                        Selected Users
                                    </span>
                                </button>

                                {/* ===========================
                                    User List
                                =========================== */}

                                {drawingPermission?.mode ===
                                    "selected" && (
                                    <div
                                        className="
                                            mt-2
                                            border-t
                                            border-slate-800/80
                                            pt-3

                                            sm:mt-3
                                            sm:pt-4
                                        "
                                    >
                                        <div
                                            className="
                                                mb-2
                                                flex
                                                items-center
                                                justify-between
                                                gap-2
                                            "
                                        >
                                            <p
                                                className="
                                                    truncate
                                                    text-[10px]
                                                    font-semibold
                                                    text-slate-400
                                                    sm:text-xs
                                                "
                                            >
                                                Select users
                                            </p>

                                            <span
                                                className="
                                                    shrink-0
                                                    text-[8px]
                                                    text-slate-600
                                                "
                                            >
                                                {
                                                    drawingPermission
                                                        ?.allowedUsers
                                                        ?.length
                                                }{" "}
                                                selected
                                            </span>
                                        </div>

                                        <div
                                            className="
                                                max-h-[min(16rem,42vh)]
                                                space-y-1
                                                overflow-y-auto
                                                overflow-x-hidden
                                                pr-1
                                            "
                                        >
                                            {uniqueMembers.map(
                                                (
                                                    member
                                                ) => {
                                                    const userId =
                                                        getUserId(
                                                            member
                                                        );

                                                    if (
                                                        !userId
                                                    ) {
                                                        return null;
                                                    }

                                                    const selected =
                                                        drawingPermission?.allowedUsers?.includes(
                                                            userId
                                                        );

                                                    const name =
                                                        member?.name ||
                                                        member?.username ||
                                                        member?.email ||
                                                        "User";

                                                    return (
                                                        <button
                                                            key={
                                                                userId
                                                            }
                                                            type="button"
                                                            onClick={() => {
                                                                const current =
                                                                    drawingPermission?.allowedUsers ||
                                                                    [];

                                                                const next =
                                                                    selected
                                                                        ? current.filter(
                                                                              (
                                                                                  id
                                                                              ) =>
                                                                                  id !==
                                                                                  userId
                                                                          )
                                                                        : [
                                                                              ...current,
                                                                              userId,
                                                                          ];

                                                                onDrawingPermissionChange(
                                                                    {
                                                                        mode: "selected",
                                                                        allowedUsers:
                                                                            next,
                                                                    }
                                                                );
                                                            }}
                                                            className="
                                                                flex
                                                                w-full
                                                                min-w-0
                                                                items-center
                                                                gap-2.5
                                                                rounded-lg
                                                                border
                                                                border-transparent
                                                                px-2.5
                                                                py-2
                                                                text-left
                                                                text-[11px]
                                                                text-slate-300
                                                                transition-colors
                                                                hover:border-slate-700/70
                                                                hover:bg-slate-800/80
                                                                hover:text-white

                                                                sm:gap-3
                                                                sm:px-3
                                                                sm:py-2.5
                                                                sm:text-sm
                                                            "
                                                        >
                                                            <span
                                                                className={`
                                                                    flex
                                                                    h-4
                                                                    w-4
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded
                                                                    border

                                                                    ${
                                                                        selected
                                                                            ? "border-green-500 bg-green-500"
                                                                            : "border-slate-600"
                                                                    }
                                                                `}
                                                            >
                                                                {selected && (
                                                                    <span className="text-[9px] font-bold text-white">
                                                                        ✓
                                                                    </span>
                                                                )}
                                                            </span>

                                                            <span className="min-w-0 truncate">
                                                                {
                                                                    name
                                                                }
                                                            </span>
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===========================
                            Member Status
                        =========================== */}

                        {!isHost && (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-slate-800/80
                                    bg-gradient-to-b
                                    from-slate-900
                                    to-slate-950
                                    p-3
                                    shadow-lg
                                    shadow-black/10

                                    sm:rounded-2xl
                                    sm:p-4
                                    lg:p-5
                                "
                            >
                                <div
                                    className={`
                                        mb-3
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl

                                        sm:mb-4
                                        sm:h-11
                                        sm:w-11

                                        ${
                                            canDraw
                                                ? "bg-green-500/10 text-green-400"
                                                : "bg-slate-800 text-slate-500"
                                        }
                                    `}
                                >
                                    <FaPen size={14} />
                                </div>

                                <p className="text-sm font-semibold text-white">
                                    {canDraw
                                        ? "Drawing allowed"
                                        : "Drawing restricted"}
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-[10px]
                                        leading-4
                                        text-slate-500
                                        sm:text-xs
                                        sm:leading-5
                                    "
                                >
                                    {canDraw
                                        ? "The host has allowed you to annotate the PDF."
                                        : "The host has not allowed you to annotate the PDF."}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomCommunication;