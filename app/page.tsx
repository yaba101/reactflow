"use client";
import NodeTree from "@/components/nodetree/NodeTreeContainer";
import { useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";
// import { RootState } from "@/reduxStore/store";

import { initEdgesData, initNodesData } from "@/constant/nodetree-constants";
const getFamilyData = async (token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/endpoint`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

const Page = () => {
  // !! ASSUME WE have redux that fetch user data
  const user = { token: "fajsfkdjkfkasfsdkfjksdjfk" };
  // const user = useSelector((state: RootState) => state.user);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["get-data"],
    queryFn: () => getFamilyData(user?.token!),
    // suspense: true,
  });

  if (isLoading || isFetching) return;

  return (
    <div className="h-full overflow-hidden">
      <div className="mt-20 flex h-full w-full flex-1 flex-col space-x-1 overflow-hidden md:mt-0 lg:flex-row">
        <div className={`w-full lg:w-4/5`}>
          {/* !! If you try this it is not working.............................. */}
          {/* <NodeTree
            initialNodes={data.people}
            initialEdges={data.relationships}
          /> */}

          {/* working with constant data */}
          <NodeTree initialNodes={initNodesData} initialEdges={initEdgesData} />
        </div>
      </div>
    </div>
  );
};

export default Page;
