import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();
export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/sign-in");
  }
  const users = await prisma.user.findMany();
  return (
    <div>
      <h2>There are {users.length} users</h2>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      <Button>Click me</Button>
    </div>
  );
}
