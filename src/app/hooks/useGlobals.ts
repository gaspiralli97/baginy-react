
import { Member } from "../../lib/types/member";
import { useContext, createContext } from "react";

interface GlobalInterface{
    authMember:Member | null;
    setAuthMember:(member:Member | null) => void;
    orderBuilder: Date;
    setOrderBuilder:(input:Date) => void;
    goldMode: boolean;
    setGoldMode:(value:boolean) => void;
}

export const GlobalContext=createContext<GlobalInterface | undefined>(undefined);

export const useGlobals = () =>{
    const context = useContext(GlobalContext);
    if(context === undefined) throw new Error("useGlobals without Provider");
    return context;
};