
export function convertSnaps<T>(result) {
    return <T[]>result.docs.map(snap => {
        return {
            id: snap.id,
            ...<any>snap.data()
        }
    })
}