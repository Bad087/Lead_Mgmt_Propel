import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const PRESET_USERS: Record<UserRole, User> = {
  panel_reviewer: {
    id: 'user_eval_01',
    name: 'Prof. Manjula S & Dr. Bheemsha Arya',
    email: 'panel.evaluator@bmsce.ac.in',
    role: 'panel_reviewer',
    organization: 'B.M.S. College of Engineering, Bengaluru',
    title: 'Senior Capstone Evaluation Panel',
    avatarInitials: 'PE',
  },
  sales_director: {
    id: 'user_sales_02',
    name: 'Rajesh Malhotra',
    email: 'rajesh.m@propeliq-estates.com',
    role: 'sales_director',
    organization: 'PropelIQ Luxury Properties Group',
    title: 'VP of Commercial & Ultra-Luxury Sales',
    avatarInitials: 'RM',
  },
  lead_analyst: {
    id: 'user_analyst_03',
    name: 'Hritik H & Capstone Team',
    email: 'hritikbad87@gmail.com',
    role: 'lead_analyst',
    organization: 'Department of Information Science & Eng.',
    title: 'Lead ML / DL Research Engineer',
    avatarInitials: 'HH',
  },
  broker: {
    id: 'user_broker_04',
    name: 'Priya Narayanan',
    email: 'priya.n@primeproperties.in',
    role: 'broker',
    organization: 'Prime Metro Real Estate Advisory',
    title: 'Senior Residential Asset Specialist',
    avatarInitials: 'PN',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('propeliq_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return PRESET_USERS.lead_analyst;
      }
    }
    return PRESET_USERS.lead_analyst; // Default to Lead Analyst for presentation review
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('propeliq_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('propeliq_auth_user');
    }
  }, [user]);

  const loginAs = (role: UserRole) => {
    const selectedUser = PRESET_USERS[role];
    setUser(selectedUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAs,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
