export const aggregatePosts = (rows) => {
    const result = [];

    for (const row of rows) {
        const existingPost = result.find(r => r.id === row.id);
        if (!existingPost) {
            result.push({ ...row.posts, comments: [row.comments] })
        } else {
            result.find(r => r.id === row.id).comments.push(row.comments)
        }
    }
    return result;


    // return rows.reduce(
    //     // const result = rows.reduce<Record<number, { user: User; pets: Pet[] }>>(
    //     (acc, row) => {
    //         const post = row.posts;
    //         const comment = row.comments;
    //         if (!acc[post.id]) {
    //             acc[post.id] = { post, pets: [] };
    //         }
    //         if (comments) {
    //             acc[post.id].comments.push(comments);
    //         }
    //         return acc;
    //     },
    //     {}
    // );

    // const result = rows.reduce<Record<number, { user: User; pets: Pet[] }>>(
    // const result = rows.reduce(
    //     (acc, row) => {
    //         const name = row[target];
    //         const _name = row[_target];
    //         if (!acc[target.id]) {
    //             acc[target.id] = { target, [_name]: [] };
    //         }
    //         if (_name) {
    //             acc[target].id[_target].push(_name);
    //         }
    //         return acc;
    //     },
    //     {}
    // );
    // return result
}
// const result = rows.reduce(
//     // const result = rows.reduce<Record<number, { user: User; pets: Pet[] }>>(
//     (acc, row) => {
//         const user = row.user;
//         const pet = row.pet;
//         if (!acc[user.id]) {
//             acc[user.id] = { user, pets: [] };
//         }
//         if (pet) {
//             acc[user.id].pets.push(pet);
//         }
//         return acc;
//     },
//     {}
// );
// return result
// }