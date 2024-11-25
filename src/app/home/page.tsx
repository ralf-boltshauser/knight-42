// pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="bg-gray-800">
        <div className="container mx-auto py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">KNIGHT 42</h1>
          <nav>
            <a href="#features" className="text-gray-300 hover:text-white px-4">
              Features
            </a>
            <a href="#about" className="text-gray-300 hover:text-white px-4">
              About
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white px-4">
              Contact
            </a>
          </nav>
        </div>
      </header>
      <main>
        <section
          id="hero"
          className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 py-20 text-center"
        >
          <div className="container mx-auto">
            <h2 className="text-4xl font-extrabold">
              Knowledge Network for Incident Management
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Track assets, manage alerts, and map incidents with precision.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/sign-in"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-md font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-900">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold text-center">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
              <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold">Track Assets</h4>
                <p className="mt-2 text-gray-400">
                  Monitor and manage your assets in real-time.
                </p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold">Incident Escalation</h4>
                <p className="mt-2 text-gray-400">
                  Seamlessly escalate alerts to incidents and manage them.
                </p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold">Kanban Boards</h4>
                <p className="mt-2 text-gray-400">
                  Organize response actions and IOCs on a Kanban board.
                </p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold">Attack Chains</h4>
                <p className="mt-2 text-gray-400">
                  Map incidents in attack chains for better clarity.
                </p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold">Response Actions</h4>
                <p className="mt-2 text-gray-400">
                  Track and manage response actions effectively.
                </p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold">Real-Time Updates</h4>
                <p className="mt-2 text-gray-400">
                  Get real-time updates for your incidents and actions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-gray-800 text-center">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold">About KNIGHT 42</h3>
            <p className="mt-4 text-gray-400">
              KNIGHT 42 is the ultimate solution for incident tracking,
              escalation, and management. Built with cutting-edge technology for
              clear insights and efficient handling of alerts and IOCs.
            </p>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            © 2024 KNIGHT 42. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
