import { redirect } from 'next/navigation'

interface Props {
  params: { saToken: string }
}

export default function SATokenRoot({ params }: Props) {
  redirect(`/${params.saToken}/secure-access`)
}
