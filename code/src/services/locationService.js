import { supabase } from '../lib/supabase';

export const locationService = {
  // Get all provinces
  async getProvinces() {
    try {
      const { data, error } = await supabase
        ?.from('provinces')
        ?.select('*')
        ?.order('name');

      return { data: data || [], error };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: [],
          error: { 
            message: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
          } 
        };
      }
      return { data: [], error };
    }
  },

  // Get districts by province
  async getDistrictsByProvince(provinceId) {
    try {
      const { data, error } = await supabase
        ?.from('districts')
        ?.select('*')
        ?.eq('province_id', provinceId)
        ?.order('name');

      return { data: data || [], error };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: [],
          error: { 
            message: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
          } 
        };
      }
      return { data: [], error };
    }
  },

  // Get wards by district
  async getWardsByDistrict(districtId) {
    try {
      const { data, error } = await supabase
        ?.from('wards')
        ?.select('*')
        ?.eq('district_id', districtId)
        ?.order('name');

      return { data: data || [], error };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: [],
          error: { 
            message: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
          } 
        };
      }
      return { data: [], error };
    }
  }
};

export default locationService;