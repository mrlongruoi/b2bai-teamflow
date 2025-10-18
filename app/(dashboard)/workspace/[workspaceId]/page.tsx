import { client } from "@/lib/orpc"
import { redirect } from "next/navigation";
import { GrChannel } from "react-icons/gr";
import { ArrowUpRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CreateNewChannel } from "./_components/CreateNewChannel";

interface iAppProps {
  params: Promise<{ workspaceId: string }>
}

const WorkspaceIdPage = async ({ params }: iAppProps) => {
  const { workspaceId } = await params;

  const { channels } = await client.channel.list();

  if (channels.length > 0) {
    return redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`)
  }

  return (
    <div className="p-16 flex flex-1">
      <Empty className="border border-dashed from-muted/50 to-background h-full bg-gradient-to-b from-30%">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <GrChannel />
          </EmptyMedia>
          <EmptyTitle>Chưa có kênh nào!</EmptyTitle>
          <EmptyDescription>
            Tạo kênh đầu tiên của bạn để bắt đầu!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="max-w-xs mx-auto">
          <CreateNewChannel />
        </EmptyContent>
      </Empty>
    </div>
  )
}

export default WorkspaceIdPage
