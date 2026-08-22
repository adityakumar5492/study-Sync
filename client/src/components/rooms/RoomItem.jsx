import {
    FaUsers,
    FaLock,
    FaGlobe,
    FaArrowRight,
    FaUserShield,
    FaCircle,
} from "react-icons/fa";
import {
    motion,
    useReducedMotion,
} from "framer-motion";

import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { requestRoomRejoin } from "../../api/room.api";
import socket from "../../socket/socket";

import JoinPrivateRoomModal from "./JoinPrivateRoomModal";

import { useAppSelector } from "../../redux/hooks";

const RoomItem = ({ room }) => {
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();

    const { user } = useAppSelector(
        (state) => state.auth
    );

    const [showJoinModal, setShowJoinModal] =
        useState(false);

    const [requestingRejoin, setRequestingRejoin] =
        useState(false);

    // ===========================
    // User / Membership
    // ===========================

    const hostId =
        typeof room.host === "object"
            ? room.host?._id?.toString()
            : room.host?.toString();

    const currentUserId =
        user?._id?.toString();

    const isHost =
        hostId === currentUserId;

    const isMember =
        room.members?.some((member) => {
            const memberId =
                typeof member === "object"
                    ? member?._id?.toString()
                    : member?.toString();

            return memberId === currentUserId;
        });

    const isRemoved =
        !isMember &&
        room.removedMembers?.some((entry) => {
            const removedUserId =
                typeof entry.user === "object"
                    ? entry.user?._id?.toString()
                    : entry.user?.toString();

            return (
                removedUserId === currentUserId
            );
        });

    // ===========================
    // Room Metadata
    // ===========================

    const memberCount =
        room.members?.length || 0;

    const maxMembers =
        room.maxMembers || 20;

    const occupancyPercentage = Math.min(
        (memberCount / maxMembers) * 100,
        100
    );

    const isPrivate = Boolean(room.isPrivate);
    const isActive = Boolean(room.isActive);

    const actionLabel = isRemoved
        ? requestingRejoin
            ? "Requesting..."
            : "Request Rejoin"
        : isPrivate && !isHost && !isMember
        ? "Join Room"
        : "Open Room";

    // ===========================
    // Open Room
    // ===========================

    const handleOpen = () => {
        if (
            room.isPrivate &&
            !isHost &&
            !isMember
        ) {
            setShowJoinModal(true);
            return;
        }

        navigate(`/room/${room._id}`);
    };

    // ===========================
    // Request Rejoin
    // ===========================

    const handleRequestRejoin = async () => {
        if (requestingRejoin) return;

        try {
            setRequestingRejoin(true);

            const { data } =
                await requestRoomRejoin(
                    room._id
                );

            socket.emit(
                "room:rejoin-request",
                {
                    roomId: room._id,
                    userId: currentUserId,
                }
            );

            toast.success(
                data.message ||
                    "Rejoin request sent."
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to send rejoin request."
            );
        } finally {
            setRequestingRejoin(false);
        }
    };

    return (
        <>
            <motion.article
                initial={{
                    opacity: 0,
                    y: shouldReduceMotion
                        ? 0
                        : 12,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                whileHover={
                    shouldReduceMotion
                        ? undefined
                        : {
                              y: -3,
                          }
                }
                transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className="
                    group
                    relative
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-white/[0.065]
                    bg-[#0a0f1c]
                    p-4
                    shadow-[0_12px_45px_rgba(0,0,0,0.16)]
                    transition-shadow
                    duration-300
                    hover:border-indigo-400/[0.18]
                    hover:shadow-[0_20px_65px_rgba(0,0,0,0.25)]
                    sm:p-5
                    lg:p-6
                "
            >
                {/* =================================
                    AMBIENT LIGHT
                ================================= */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-20
                        -top-20
                        h-44
                        w-44
                        rounded-full
                        bg-indigo-500/[0.045]
                        blur-[80px]
                        transition-all
                        duration-500
                        group-hover:bg-indigo-500/[0.09]
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        -left-16
                        h-40
                        w-40
                        rounded-full
                        bg-violet-500/[0.025]
                        blur-[80px]
                    "
                />

                {/* Top subtle highlight */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-x-10
                        top-0
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-white/[0.08]
                        to-transparent
                    "
                />

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">

                    {/* =================================
                        ROOM INFORMATION
                    ================================= */}

                    <div className="min-w-0 flex-1">

                        {/* Room Identity */}
                        <div className="flex min-w-0 items-start gap-3">

                            {/* Room Icon */}
                            <div
                                className={`
                                    relative
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    ${
                                        isPrivate
                                            ? "border-amber-400/10 bg-amber-400/[0.07] text-amber-400"
                                            : "border-cyan-400/10 bg-cyan-400/[0.07] text-cyan-400"
                                    }
                                `}
                            >
                                {isPrivate ? (
                                    <FaLock className="text-sm" />
                                ) : (
                                    <FaGlobe className="text-sm" />
                                )}

                                {/* Online indicator */}
                                {isActive && (
                                    <motion.span
                                        animate={
                                            shouldReduceMotion
                                                ? undefined
                                                : {
                                                      opacity: [
                                                          0.45,
                                                          1,
                                                          0.45,
                                                      ],
                                                  }
                                        }
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="
                                            absolute
                                            -right-0.5
                                            -top-0.5
                                            h-2.5
                                            w-2.5
                                            rounded-full
                                            border-2
                                            border-[#0a0f1c]
                                            bg-emerald-400
                                        "
                                    />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">

                                {/* Title + Badge */}
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                    <h2 className="min-w-0 max-w-full truncate text-base font-bold tracking-tight text-white sm:text-lg">
                                        {room.name}
                                    </h2>

                                    <span
                                        className={`
                                            shrink-0
                                            rounded-full
                                            border
                                            px-2
                                            py-0.5
                                            text-[8px]
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            ${
                                                isPrivate
                                                    ? "border-amber-400/10 bg-amber-400/[0.05] text-amber-400"
                                                    : "border-cyan-400/10 bg-cyan-400/[0.05] text-cyan-400"
                                            }
                                        `}
                                    >
                                        {isPrivate
                                            ? "Private"
                                            : "Public"}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-6 text-slate-500">
                                    {room.description ||
                                        "No description provided."}
                                </p>
                            </div>
                        </div>

                        {/* =================================
                            METADATA
                        ================================= */}

                        <div className="mt-5 flex flex-wrap items-center gap-2">

                            {/* Members */}
                            <div className="flex items-center gap-2 rounded-full border border-white/[0.055] bg-white/[0.02] px-3 py-1.5">
                                <FaUsers className="text-[10px] text-slate-600" />

                                <span className="text-[10px] font-semibold text-slate-500 sm:text-xs">
                                    {memberCount}/
                                    {maxMembers}
                                </span>

                                <span className="text-[10px] text-slate-700">
                                    members
                                </span>
                            </div>

                            {/* Status */}
                            <div
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    px-3
                                    py-1.5
                                    ${
                                        isActive
                                            ? "border-emerald-400/10 bg-emerald-400/[0.04]"
                                            : "border-white/[0.055] bg-white/[0.02]"
                                    }
                                `}
                            >
                                <motion.span
                                    animate={
                                        isActive &&
                                        !shouldReduceMotion
                                            ? {
                                                  opacity: [
                                                      0.45,
                                                      1,
                                                      0.45,
                                                  ],
                                              }
                                            : undefined
                                    }
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className={`
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        ${
                                            isActive
                                                ? "bg-emerald-400"
                                                : "bg-slate-600"
                                        }
                                    `}
                                />

                                <span
                                    className={`
                                        text-[10px]
                                        font-semibold
                                        sm:text-xs
                                        ${
                                            isActive
                                                ? "text-emerald-400"
                                                : "text-slate-600"
                                        }
                                    `}
                                >
                                    {isActive
                                        ? "Active now"
                                        : "Inactive"}
                                </span>
                            </div>

                            {/* Host */}
                            <div className="flex min-w-0 items-center gap-1.5 rounded-full border border-white/[0.055] bg-white/[0.02] px-3 py-1.5">
                                <FaUserShield className="shrink-0 text-[9px] text-slate-700" />

                                <span className="max-w-36 truncate text-[10px] font-medium text-slate-600 sm:max-w-44 sm:text-xs">
                                    {room.host?.name ||
                                        "Unknown"}
                                </span>
                            </div>
                        </div>

                        {/* =================================
                            CAPACITY BAR
                        ================================= */}

                        <div className="mt-4 max-w-xl">

                            <div className="mb-1.5 flex items-center justify-between">
                                <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-slate-700">
                                    Room capacity
                                </span>

                                <span className="text-[9px] font-semibold text-slate-600">
                                    {Math.round(
                                        occupancyPercentage
                                    )}
                                    %
                                </span>
                            </div>

                            <div className="h-1 overflow-hidden rounded-full bg-white/[0.04]">
                                <motion.div
                                    initial={{
                                        width: 0,
                                    }}
                                    animate={{
                                        width: `${occupancyPercentage}%`,
                                    }}
                                    transition={{
                                        delay: 0.15,
                                        duration: 0.7,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className={`
                                        h-full
                                        rounded-full
                                        ${
                                            occupancyPercentage >=
                                            90
                                                ? "bg-amber-400/70"
                                                : "bg-indigo-400/70"
                                        }
                                    `}
                                />
                            </div>
                        </div>
                    </div>

                    {/* =================================
                        ACTION
                    ================================= */}

                    <div className="w-full shrink-0 lg:w-auto">

                        {isRemoved ? (
                            <motion.button
                                type="button"
                                onClick={
                                    handleRequestRejoin
                                }
                                disabled={
                                    requestingRejoin
                                }
                                whileHover={
                                    shouldReduceMotion ||
                                    requestingRejoin
                                        ? undefined
                                        : {
                                              y: -2,
                                          }
                                }
                                whileTap={
                                    shouldReduceMotion ||
                                    requestingRejoin
                                        ? undefined
                                        : {
                                              scale: 0.98,
                                          }
                                }
                                className="
                                    group/action
                                    flex
                                    min-h-11
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2.5
                                    rounded-2xl
                                    border
                                    border-orange-400/10
                                    bg-orange-400/[0.06]
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-bold
                                    text-orange-400
                                    transition-all
                                    duration-300
                                    hover:border-orange-400/20
                                    hover:bg-orange-400
                                    hover:text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    sm:min-h-12
                                    lg:w-auto
                                    lg:min-w-[150px]
                                "
                            >
                                {requestingRejoin ? (
                                    <>
                                        <motion.span
                                            animate={{
                                                rotate: 360,
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="
                                                h-3.5
                                                w-3.5
                                                rounded-full
                                                border-2
                                                border-orange-400/20
                                                border-t-orange-400
                                            "
                                        />

                                        Requesting...
                                    </>
                                ) : (
                                    <>
                                        Request Rejoin

                                        <FaArrowRight className="text-[9px] transition-transform duration-300 group-hover/action:translate-x-1" />
                                    </>
                                )}
                            </motion.button>
                        ) : (
                            <motion.button
                                type="button"
                                onClick={handleOpen}
                                whileHover={
                                    shouldReduceMotion
                                        ? undefined
                                        : {
                                              y: -2,
                                          }
                                }
                                whileTap={
                                    shouldReduceMotion
                                        ? undefined
                                        : {
                                              scale: 0.98,
                                          }
                                }
                                className="
                                    group/action
                                    relative
                                    flex
                                    min-h-11
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2.5
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-indigo-400/10
                                    bg-indigo-500/[0.07]
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-bold
                                    text-indigo-300
                                    transition-all
                                    duration-300
                                    hover:border-indigo-400/20
                                    hover:bg-indigo-500
                                    hover:text-white
                                    hover:shadow-[0_15px_35px_rgba(99,102,241,0.18)]
                                    sm:min-h-12
                                    lg:w-auto
                                    lg:min-w-[130px]
                                "
                            >
                                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover/action:translate-x-full" />

                                <span className="relative">
                                    {actionLabel}
                                </span>

                                <FaArrowRight className="relative text-[9px] transition-transform duration-300 group-hover/action:translate-x-1" />
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Removed indicator */}
                {isRemoved && (
                    <div className="relative mt-4 flex items-center gap-2 border-t border-white/[0.04] pt-3">
                        <FaCircle className="text-[5px] text-orange-400/70" />

                        <p className="text-[10px] text-slate-600">
                            You were removed from this
                            room. Request access again
                            to rejoin.
                        </p>
                    </div>
                )}
            </motion.article>

            {/* =================================
                PRIVATE ROOM MODAL
            ================================= */}

            <JoinPrivateRoomModal
                isOpen={showJoinModal}
                room={room}
                onClose={() =>
                    setShowJoinModal(false)
                }
            />
        </>
    );
};

export default RoomItem;