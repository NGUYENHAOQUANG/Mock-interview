"use client";
import React, { ReactNode, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs"; // hook này lấy thông tin user
import { useState } from "react";
import { UserDetailContext } from "@/context/UserDetailProvider";
function Provider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const CreateUser = useMutation(api.users.CreateNewUser);
  const [userDetails, setUserDetails] = useState<any>(null);

  const CreateNewUser = async () => {
    if (user) {
      const result = await CreateUser({
        name: user?.fullName ?? "",
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: user?.imageUrl,
      });
      console.log(result);
      setUserDetails(result);
    }
  };
  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);
  return (
    <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
}

export default Provider;
