const COLLABORATOR_COLORS = [
    "#02B1CC",
    "#11B3A3",
    "#39B178",
    "#55B467",
    "#7B66DC",
    "#9D5BD2",
    "#BD54C6",
    "#E34BA9",
    "#EC5E41",
    "#F04F88",
    "#F2555A",
    "#FF802B",
];

export const getCollaboratorColor = (userId) => {
    if (!userId) {
        return COLLABORATOR_COLORS[0];
    }

    const id = userId.toString();

    let hash = 0;

    for (let i = 0; i < id.length; i++) {
        hash =
            (hash << 5) -
            hash +
            id.charCodeAt(i);

        hash |= 0;
    }

    return COLLABORATOR_COLORS[
        Math.abs(hash) %
            COLLABORATOR_COLORS.length
    ];
};