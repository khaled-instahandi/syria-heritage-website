import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { api } from '../lib/api'
import {
    Project,
    ProjectsResponse,
    ProjectFilters as BaseProjectFilters,
    CreateProjectData,
    UpdateProjectData
} from '../lib/types'

// معايير البحث والفلترة للمشاريع مع دعم "all"
interface ProjectFilters extends Omit<BaseProjectFilters, 'project_category' | 'status' | 'governorate'> {
    project_category?: "ترميم" | "إعادة إعمار" | "all"
    status?: "قيد الدراسة" | "قيد التنفيذ" | "مكتمل" | "all"
    governorate?: string | "all"
}

interface UseProjectsOptions {
    autoFetch?: boolean
    initialFilters?: ProjectFilters
}

interface UseProjectsReturn {
    projects: Project[]
    loading: boolean
    error: string | null
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        perPage: number
        hasNext: boolean
        hasPrev: boolean
    }
    filters: ProjectFilters

    // Actions
    fetchProjects: (newFilters?: ProjectFilters) => Promise<void>
    createProject: (data: CreateProjectData) => Promise<Project | null>
    updateProject: (id: number, data: UpdateProjectData) => Promise<Project | null>
    deleteProject: (id: number) => Promise<boolean>
    setFilters: (newFilters: ProjectFilters) => void
    resetFilters: () => void
    refresh: () => Promise<void>

    // Utilities
    getProjectById: (id: number) => Project | undefined
    getFilteredProjects: () => Project[]

    // Stats
    stats: {
        total: number
        completed: number
        inProgress: number
        planning: number
        reconstruction: number
        restoration: number
    }
}

const defaultFilters: ProjectFilters = {
    page: 1,
    per_page: 10,
    search: '',
    project_category: 'all',
    status: 'all',
    approved_by: '',
    date_from: '',
    date_to: ''
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
    const { autoFetch = true, initialFilters = {} } = options

    // State
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFiltersState] = useState<ProjectFilters>({
        ...defaultFilters,
        ...initialFilters
    })
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 10,
        hasNext: false,
        hasPrev: false
    })

    // تحويل الفلاتر المحلية إلى فلاتر API
    const convertFiltersForApi = (localFilters: ProjectFilters): BaseProjectFilters => {
        const apiFilters: BaseProjectFilters = {}

        // نسخ كل القيم
        Object.keys(localFilters).forEach(key => {
            if (key !== 'project_category' && key !== 'status' && key !== 'governorate' && key !== 'mosque_id') {
                (apiFilters as any)[key] = (localFilters as any)[key]
            }
        })

        // معالجة خاصة للفئة والحالة
        if (localFilters.project_category && localFilters.project_category !== 'all') {
            apiFilters.project_category = localFilters.project_category as "ترميم" | "إعادة إعمار"
        }

        if (localFilters.status && localFilters.status !== 'all') {
            apiFilters.status = localFilters.status as "قيد الدراسة" | "قيد التنفيذ" | "مكتمل"
        }

        // معالجة mosque_id
        if (localFilters.mosque_id && localFilters.mosque_id !== 'all') {
            apiFilters.mosque_id = typeof localFilters.mosque_id === 'string' 
                ? parseInt(localFilters.mosque_id, 10) 
                : localFilters.mosque_id
        }

        // معالجة governorate - نرسل المحافظة كفلتر منفصل أو نتعامل معه في البحث
        if (localFilters.governorate && localFilters.governorate !== 'all') {
            apiFilters.governorate = localFilters.governorate
        }

        return apiFilters
    }

    // جلب المشاريع
    const fetchProjects = useCallback(async (newFilters?: ProjectFilters) => {
        setLoading(true)
        setError(null)

        try {
            const filtersToUse = newFilters || filters
            const apiFilters = convertFiltersForApi(filtersToUse)
            const response: ProjectsResponse = await api.getProjects(apiFilters)

            setProjects(response.data)
            setPagination({
                currentPage: response.meta.current_page,
                totalPages: response.meta.last_page,
                totalItems: response.meta.total,
                perPage: response.meta.per_page,
                hasNext: !!response.links.next,
                hasPrev: !!response.links.prev
            })

            if (newFilters) {
                setFiltersState(prev => ({ ...prev, ...newFilters }))
            }
        } catch (err: any) {
            console.error('Error fetching projects:', err)
            setError(err.message || 'حدث خطأ في جلب المشاريع')
            setProjects([])
        } finally {
            setLoading(false)
        }
    }, [filters])

    // إنشاء مشروع جديد
    const createProject = useCallback(async (data: CreateProjectData): Promise<Project | null> => {
        setLoading(true)
        setError(null)

        try {
            const response = await api.createProject(data)

            // إضافة المشروع الجديد إلى القائمة
            setProjects(prev => [response.data, ...prev])

            toast.success('تم إنشاء المشروع بنجاح')
            return response.data
        } catch (err: any) {
            console.error('Error creating project:', err)
            const errorMessage = err.message || 'حدث خطأ في إنشاء المشروع'
            setError(errorMessage)
            toast.error(errorMessage)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    // تحديث مشروع
    const updateProject = useCallback(async (id: number, data: UpdateProjectData): Promise<Project | null> => {
        setLoading(true)
        setError(null)

        try {
            const response = await api.updateProject(id, data)

            // تحديث المشروع في القائمة
            setProjects(prev =>
                prev.map(project =>
                    project.id === id ? response.data : project
                )
            )

            toast.success('تم تحديث المشروع بنجاح')
            return response.data
        } catch (err: any) {
            console.error('Error updating project:', err)
            const errorMessage = err.message || 'حدث خطأ في تحديث المشروع'
            setError(errorMessage)
            toast.error(errorMessage)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    // حذف مشروع
    const deleteProject = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            await api.deleteProject(id)

            // إزالة المشروع من القائمة
            setProjects(prev => prev.filter(project => project.id !== id))

            toast.success('تم حذف المشروع بنجاح')
            return true
        } catch (err: any) {
            console.error('Error deleting project:', err)
            const errorMessage = err.message || 'حدث خطأ في حذف المشروع'
            setError(errorMessage)
            toast.error(errorMessage)
            return false
        } finally {
            setLoading(false)
        }
    }, [])

    // تحديث الفلاتر
    const setFilters = useCallback((newFilters: Partial<ProjectFilters>) => {
        setFiltersState(prev => ({ ...prev, ...newFilters, page: 1 }))
    }, [])

    // إعادة تعيين الفلاتر
    const resetFilters = useCallback(() => {
        setFiltersState(defaultFilters)
    }, [])

    // تحديث البيانات
    const refresh = useCallback(() => {
        return fetchProjects()
    }, [fetchProjects])

    // البحث عن مشروع بالمعرف
    const getProjectById = useCallback((id: number): Project | undefined => {
        return projects.find(project => project.id === id)
    }, [projects])

    // الحصول على المشاريع المفلترة محلياً
    const getFilteredProjects = useCallback((): Project[] => {
        return projects.filter(project => {
            // تطبيق فلاتر إضافية محلية إذا لزم الأمر
            if (filters.search && filters.search.trim()) {
                const searchTerm = filters.search.toLowerCase()
                const matchesSearch =
                    project.mosque_ar?.toLowerCase().includes(searchTerm) ||
                    project.mosque_en?.toLowerCase().includes(searchTerm)
                if (!matchesSearch) return false
            }

            if (filters.project_category && filters.project_category !== 'all') {
                if (project.project_category !== filters.project_category) return false
            }

            if (filters.status && filters.status !== 'all') {
                if (project.status !== filters.status) return false
            }

            return true
        })
    }, [projects, filters])

    // التحميل التلقائي عند التركيب أو تغيير الفلاتر
    useEffect(() => {
        if (autoFetch) {
            fetchProjects()
        }
    }, [filters.page, filters.per_page, autoFetch])

    // إحصائيات مفيدة
    const stats = {
        total: projects.length,
        completed: projects.filter(p => p.status === 'مكتمل').length,
        inProgress: projects.filter(p => p.status === 'قيد التنفيذ').length,
        planning: projects.filter(p => p.status === 'قيد الدراسة').length,
        reconstruction: projects.filter(p => p.project_category === 'إعادة إعمار').length,
        restoration: projects.filter(p => p.project_category === 'ترميم').length
    }

    return {
        projects,
        loading,
        error,
        pagination,
        filters,

        // Actions
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
        setFilters,
        resetFilters,
        refresh,

        // Utilities
        getProjectById,
        getFilteredProjects,

        // Stats
        stats
    }
}

// Hook للحصول على مشروع واحد
export function useProject(id: number) {
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProject = useCallback(async () => {
        if (!id) return

        setLoading(true)
        setError(null)

        try {
            const response = await api.getProject(id)
            setProject(response.data)
        } catch (err: any) {
            console.error('Error fetching project:', err)
            setError(err.message || 'حدث خطأ في جلب تفاصيل المشروع')
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchProject()
    }, [fetchProject])

    return {
        project,
        loading,
        error,
        refresh: fetchProject
    }
}
