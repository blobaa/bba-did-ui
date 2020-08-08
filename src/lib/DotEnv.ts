

export default class DotEnv {
    public static isDev = process.env.IS_DEV && true;

    public static testnetUrl = process.env.TESTNET_URL || "";
    public static mainnetUrl = process.env.MAINNET_URL || "";

    public static minTestnetBalance = parseInt(process.env.MIN_TESTNET_BALANCE || "") || 0;
    public static minMainnetBalance = parseInt(process.env.MIN_MAINNET_BALANCE || "") || 0;
}