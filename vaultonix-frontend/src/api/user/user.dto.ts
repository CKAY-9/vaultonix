export interface UserDTO {
    id: number,
    discord_id: string,
    token: string,
    username: string,
    avatar_url: string,
    joined: Date,
    supporter: boolean
}