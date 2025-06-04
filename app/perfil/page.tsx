"use client"

import type React from "react"

import { useState } from "react"

export default function ProfilePage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  
  // Mock user profile data
  const [profile, setProfile] = useState({
    name: "João Paulo Silva",
    email: "joao.paulo@exemplo.com",
    phone: "(11) 98765-4321",
    role: "Produtor",
    company: "EcoTêxtil Brasil",
    cnpj: "12.345.678/0001-90",
    bio: "Produtor de materiais têxteis sustentáveis com mais de 10 anos de experiência no mercado.",
    address: {
      street: "Rua da Sustentabilidade, 123",
      city: "São Paulo",
      state: "SP",
      zip: "01234-567",
      country: "Brasil",
    },
    website: "www.ecotextil.com.br",
    joinDate: "Maio de 2020",
    activeListings: 24,
    completedSales: 156,
    certifications: [
      "Produção Orgânica",
      "Comércio Justo",
      "Carbono Neutro",
    ],
    notificationPreferences: {
      emails: true,
      messages: true,
      orders: true,
      promotions: false,
      news: true,
    },
    passwordLastChanged: "12/01/2023",
  })
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setProfile({
        ...profile,
        [parent]: {
          ...profile[parent as keyof typeof profile],
          [child]: value,
        },
      })
    } else {
      setProfile({
        ...profile,
        [name]: value,
      })
    }
  }
  
  const handleSaveProfile = () => {
    // Here you would send the profile data to an API
    console.log("Saving profile:", profile)
    setIsEditing(false)
  }
  
  const handleNotificationChange = (key: string, value: boolean) => {
    setProfile({
      ...profile,
      notificationPreferences: {
        ...profile.notificationPreferences,
        [key]: value,
      },
    })
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-dark text-white z-30 transition-all duration-300 ${
          sidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            \
