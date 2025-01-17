import axios from "axios";
import memoize from "memoizee";
import { crvusd } from "./crvusd.js";
import { IExtendedPoolDataFromApi, INetworkName } from "./interfaces";

export const _getPoolsFromApi = memoize(
    async (network: INetworkName, poolType: "main" | "crypto" | "factory" | "factory-crvusd" | "factory-crypto"): Promise<IExtendedPoolDataFromApi> => {
        const url = `https://api.curve.fi/api/getPools/${network}/${poolType}`;
        const response = await axios.get(url, { validateStatus: () => true });
        return response.data.data ?? { poolData: [], tvl: 0, tvlAll: 0 };
    },
    {
        promise: true,
        maxAge: 5 * 60 * 1000, // 5m
    }
)

export const _getUserCollateral = memoize(
    async (network: INetworkName, collateral: string, user: string, collateralDecimals = 18): Promise<string> => {
        console.log(network, collateral, user);
        const url = `https://prices.curve.fi/v1/stablecoin/collateral/events/${network}/${collateral}/${user}`;
        console.log(url);
        const response = await axios.get(url, { validateStatus: () => true });
        console.log(response);
        return crvusd.formatUnits(crvusd.parseUnits(response.data.total_collateral ?? "0.0", 0), collateralDecimals);
    },
    {
        promise: true,
        maxAge: 60 * 1000, // 1m
    }
)