// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import axios from 'axios';
import { User, Project } from '../types';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { users as mockUsers, projects as mockProjects, projectUsers } from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7141/api';

interface AuthContextType {
  currentUser: User | null;
  userProjects: Project[];
  allUsers: User[];
  login: (userId: number) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; 
  error: string | null;
  
}

interface TokenDto { token: string; }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProjects, setUserProjects] = useState<Project[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const loadAllUsersFromMock = useCallback(() => {
        console.log("Setting all users from mock data");
        const usersWithEmail = mockUsers.map(u => ({...u, email: `${u.name.toLowerCase().replace(' ','-')}@example.com`}));
        setAllUsers(usersWithEmail);
    }, []);

    const loadUserProjectsFromMock = useCallback((userId: number) => {
        console.log(`Setting projects for user ${userId} from mock data (filtered)`);
        const userProjectIds = projectUsers.filter(pu => pu.userId === userId).map(pu => pu.projectId);
        const filteredProjects = mockProjects.map(p => ({ 
            ...p,
            createdAt: p.createdAt || new Date().toISOString(),
            customerName: mockCustomers.find(c => c.id === p.customerId)?.name || 'Unknown', 
            taskCount: 1 
        })).filter(p => userProjectIds.includes(p.id));
        setUserProjects(filteredProjects);
    }, []); 

    const login = useCallback(async (userId: number): Promise<boolean> => {
        setIsLoading(true); setError(null);
        setCurrentUser(null); setUserProjects([]); setAllUsers([]);
        localStorage.removeItem('authToken');
        try {
            const response = await axios.post<TokenDto>(`${API_URL}/auth/login`, { userId });
            if (response.data && response.data.token) {
                const token = response.data.token;
                localStorage.setItem('authToken', token);
                try {
                    const decoded = jwtDecode<{ sub: string; name: string; email: string; exp: number }>(token);
                    if (decoded.exp * 1000 <= Date.now()) throw new Error("Expired token received.");
                    const userData: User = { id: parseInt(decoded.sub, 10), name: decoded.name, email: decoded.email };
                    setCurrentUser(userData);
                    loadUserProjectsFromMock(userData.id);
                    loadAllUsersFromMock();
                    navigate('/projects');
                    setIsLoading(false); return true;
                } catch (decodeError) { throw new Error("Invalid token received."); }
            } else { throw new Error("Token not received."); }
        } catch (err: any) {
            console.error("Login failed:", err);
            setError(`Giriş başarısız: ${err.message}`);
            setCurrentUser(null); setUserProjects([]); setAllUsers([]);
            localStorage.removeItem('authToken');
            setIsLoading(false); return false;
        }
    }, [loadUserProjectsFromMock, loadAllUsersFromMock, navigate]);

    const logout = useCallback(() => {
        setCurrentUser(null); setUserProjects([]); setAllUsers([]); setError(null);
        localStorage.removeItem('authToken');
        navigate('/');
    }, [navigate]);

    useEffect(() => {
        setIsLoading(true);
        loadAllUsersFromMock();
        const token = localStorage.getItem('authToken');
        let userData: User | null = null;
        if (token) {
             try {
                const decoded = jwtDecode<{ sub: string; name: string; email: string; exp: number }>(token);
                if (decoded.exp * 1000 > Date.now()) {
                    userData = { id: parseInt(decoded.sub, 10), name: decoded.name, email: decoded.email };
                } else { localStorage.removeItem('authToken'); }
            } catch (error) { localStorage.removeItem('authToken'); }
        }

        if (userData) {
            setCurrentUser(userData);
            loadUserProjectsFromMock(userData.id);
        } else {
            setUserProjects([]);
        }
        setIsLoading(false);
    }, [loadAllUsersFromMock, loadUserProjectsFromMock]); 

    const value: AuthContextType = {
        currentUser,
        userProjects,
        allUsers,
        login,
        logout,
        isAuthenticated: !!currentUser,
        isLoading,
        error,
        
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) { throw new Error('useAuth must be used within an AuthProvider'); }
    return context;
};

import { customers as mockCustomers } from '../data/mockData';