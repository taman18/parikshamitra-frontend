import Image from "next/image";
import React from "react";

const NoDataFound = ({text = 'No data found'}) => {
  return (
    <Image
      src="/public/no-data.png"
      width={500}
      height={200}
      alt={text}
    />
  );
};

export default NoDataFound
