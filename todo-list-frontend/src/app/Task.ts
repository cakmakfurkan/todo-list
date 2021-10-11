export interface Task {
    _id: string,
    isRemind: boolean,
    task: string,
    date: Date,
    userID: string,
    createdAt: Date,
}