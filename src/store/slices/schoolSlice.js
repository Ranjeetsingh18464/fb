import { createSlice } from '@reduxjs/toolkit'

const schoolSlice = createSlice({
  name: 'school',
  initialState: { currentSchool: null, schools: [], classes: [], sections: [], subjects: [], teachers: [], students: [], parents: [], loading: false, subscription: null, customization: {} },
  reducers: {
    setCurrentSchool: (state, action) => { state.currentSchool = action.payload },
    setSchools: (state, action) => { state.schools = action.payload },
    setClasses: (state, action) => { state.classes = action.payload },
    setSections: (state, action) => { state.sections = action.payload },
    setSubjects: (state, action) => { state.subjects = action.payload },
    setTeachers: (state, action) => { state.teachers = action.payload },
    setStudents: (state, action) => { state.students = action.payload },
    setParents: (state, action) => { state.parents = action.payload },
    setSubscription: (state, action) => { state.subscription = action.payload },
    setCustomization: (state, action) => { state.customization = action.payload },
    setLoading: (state, action) => { state.loading = action.payload }
  }
})
export const { setCurrentSchool, setSchools, setClasses, setSections, setSubjects, setTeachers, setStudents, setParents, setSubscription, setCustomization, setLoading } = schoolSlice.actions
export default schoolSlice.reducer
