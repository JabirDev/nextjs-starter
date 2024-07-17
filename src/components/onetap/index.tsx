"use client";

import useOneTap from "@/hooks/useOneTap";

interface OneTapProps {
  googleClientID: string;
}

const OneTapComponent = ({ googleClientID }: OneTapProps) => {
  const { isLoading } = useOneTap({
    googleClientID,
    redirect: true,
  });

  return <div id="oneTap" className="fixed right-0 top-0" />; // This is done with tailwind. Update with system of choice
};

export default OneTapComponent;
