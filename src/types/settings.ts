export type ProfileIcon =
  | "cat"
  | "dog"
  | "fox"
  | "bear"
  | "owl"
  | "wolf"
  | "dragon"
  | "robot"
  | "alien"
  | "ghost"

export type UserSettings = {
  username: string
  profileIcon: ProfileIcon
  theme: "dark" | "light"
}