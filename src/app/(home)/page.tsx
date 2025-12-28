"use client";

import { useAllReadRooms } from "@/hooks/use-read-rooms";

export default function HomePage() {
  const { data: rooms, isLoading, isError } = useAllReadRooms();

  if (isLoading) return <div>방을 불러오는 중입니다.</div>;
  if (isError) return <div>404</div>;

  return (
    <div>
      <h1>전체 회의방 ({rooms?.total})</h1>
      <ul>
        {rooms?.rooms.map((room) => (
          <li key={room.roomId as string}>
            <h3>{room.roomTitle as string}</h3>
            <p>{room.description as string}</p>
            <span>생성자: {room.createdBy as string}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
