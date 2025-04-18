import React from "react";
import { WithAttribute } from "../types/common"

type Props<T extends WithAttribute> = {
    data: Array<T>;
};

export const FlatList = <T extends WithAttribute>({ data }: Props<T>) => {
    return (
        <div className="flex flex-col gap-y-2">
            {data?.map((d: T, index: number) => (
                <div key={index} className="p-2 border border-gray-300 shadow-md">
                    <p>{d?.title ?? ""}</p>
                </div>
            ))}
        </div>
    );
};