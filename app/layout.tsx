import "../styles/index.css";
import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
import Link from "next/link";
import GithubIcon from "@/components/GithubIcon";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="See pictures from Next.js Conf and the After Party."
        />
        <meta property="og:site_name" content="nextjsconf-pics.vercel.app" />
        <meta
          property="og:description"
          content="See pictures from Next.js Conf and the After Party."
        />
        <meta property="og:title" content="Next.js Conf 2022 Pictures" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Next.js Conf 2022 Pictures" />
        <meta
          name="twitter:description"
          content="See pictures from Next.js Conf and the After Party."
        />
      </head>
      <body className="bg-amber-50 antialiased">
        <header className="sticky top-0 z-20 mx-auto flex h-14 w-full max-w-5xl flex-row flex-nowrap items-stretch justify-between bg-amber-50 px-4 py-3 duration-1000 ease-in-out animate-in fade-in slide-in-from-top-4 sm:px-6">
          <Link href="/" className="flex flex-row items-center gap-2">
            <Image alt="logo" src="/favicon.ico" width={32} height={32} />
            <h1 className="text-2xl font-bold">:custom-slack-emoji</h1>
          </Link>
          <GithubIcon href="https://github.com/steventsao/custom-slack-emoji" />
        </header>

        <main className="mx-auto w-full max-w-5xl p-4">
          {children}
        </main>
        <footer className="p-6 text-center sm:p-12">
          <a href="https://bogeybot.com">bogeybot.com</a>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
