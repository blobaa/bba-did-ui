export default class Time {
    public static getUnixTime(): number {
        return Math.round(new Date().getTime() / 1000)
    }
}