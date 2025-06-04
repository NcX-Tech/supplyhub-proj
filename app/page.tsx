"use client"

import { redirect } from "next/navigation"
import { Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function Home() {
  const { user, userProfile, isAdmin, signOut } = useAuth()

  if (!user) {
    redirect("/login")
  }

  return (
    <ProtectedRoute>
      <div className="flex">
        <div className="w-64 bg-gray-200 h-screen">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Menu</h2>
            <ul>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 group">
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <span className="ml-3">Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 group">
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H13zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H13z"></path>
                  </svg>
                  <span className="ml-3">Kanban</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 group">
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                  </svg>
                  <span className="ml-3">Inbox</span>
                </a>
              </li>
              {isAdmin && (
                <li>
                  <a href="/admin" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 group">
                    <Shield className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                    <span className="ml-3">Painel Admin</span>
                  </a>
                </li>
              )}
              <li>
                <a
                  href="#"
                  onClick={() => signOut()}
                  className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-3">Sign Out</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1 p-4">
          <h1>Bem-vindo, {userProfile?.full_name || user?.email}!</h1>
          <p>Email: {user?.email}</p>
          {isAdmin && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
              <p className="text-red-800 font-semibold">🔐 Você está logado como Administrador</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
