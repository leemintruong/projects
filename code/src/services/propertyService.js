import { supabase } from '../lib/supabase';

export const propertyService = {
  // Get featured properties (public access)
  async getFeaturedProperties(limit = 6) {
    try {
      const { data, error } = await supabase
        ?.from('properties')
        ?.select(`
          *,
          property_images (
            image_url,
            alt_text,
            is_primary
          ),
          agent:agent_id (
            full_name,
            avatar_url
          ),
          provinces (name),
          districts (name)
        `)
        ?.eq('featured', true)
        ?.eq('listing_status', 'active')
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

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

  // Get all properties with filters
  async getProperties(filters = {}, page = 1, limit = 12) {
    try {
      let query = supabase
        ?.from('properties')
        ?.select(`
          *,
          property_images (
            image_url,
            alt_text,
            is_primary
          ),
          agent:agent_id (
            full_name,
            avatar_url
          ),
          provinces (name),
          districts (name)
        `, { count: 'exact' })
        ?.eq('listing_status', 'active');

      // Apply filters
      if (filters?.property_type) {
        query = query?.eq('property_type', filters?.property_type);
      }
      if (filters?.min_price) {
        query = query?.gte('price', filters?.min_price);
      }
      if (filters?.max_price) {
        query = query?.lte('price', filters?.max_price);
      }
      if (filters?.bedrooms) {
        query = query?.gte('bedrooms', filters?.bedrooms);
      }
      if (filters?.province_id) {
        query = query?.eq('province_id', filters?.province_id);
      }
      if (filters?.district_id) {
        query = query?.eq('district_id', filters?.district_id);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query
        ?.order('created_at', { ascending: false })
        ?.range(from, to);

      return { data: data || [], error, count };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: [],
          count: 0,
          error: { 
            message: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
          } 
        };
      }
      return { data: [], count: 0, error };
    }
  },

  // Get single property by ID
  async getPropertyById(id) {
    try {
      const { data, error } = await supabase
        ?.from('properties')
        ?.select(`
          *,
          property_images (
            image_url,
            alt_text,
            is_primary,
            display_order
          ),
          agent:agent_id (
            full_name,
            avatar_url,
            phone,
            email
          ),
          provinces (name),
          districts (name),
          wards (name)
        `)
        ?.eq('id', id)
        ?.eq('listing_status', 'active')
        ?.single();

      return { data, error };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null,
          error: { 
            message: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
          } 
        };
      }
      return { data: null, error };
    }
  },

  // Add property to favorites (requires authentication)
  async addToFavorites(propertyId, userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_favorites')
        ?.insert({ 
          user_id: userId, 
          property_id: propertyId 
        })
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null,
          error: { 
            message: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
          } 
        };
      }
      return { data: null, error };
    }
  },

  // Remove property from favorites
  async removeFromFavorites(propertyId, userId) {
    try {
      const { error } = await supabase
        ?.from('user_favorites')
        ?.delete()
        ?.eq('user_id', userId)
        ?.eq('property_id', propertyId);

      return { error };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          error: { 
            message: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
          } 
        };
      }
      return { error };
    }
  },

  // Get user's favorite properties
  async getUserFavorites(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_favorites')
        ?.select(`
          property_id,
          properties (
            *,
            property_images (
              image_url,
              alt_text,
              is_primary
            ),
            agent:agent_id (
              full_name,
              avatar_url
            ),
            provinces (name),
            districts (name)
          )
        `)
        ?.eq('user_id', userId);

      const favorites = data?.map(fav => ({
        ...fav?.properties,
        is_favorite: true
      })) || [];

      return { data: favorites, error };
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

  // Record property view
  async recordPropertyView(propertyId, userId = null) {
    try {
      const viewData = { 
        property_id: propertyId,
        viewed_at: new Date()?.toISOString()
      };
      
      if (userId) {
        viewData.user_id = userId;
      }

      const { data, error } = await supabase
        ?.from('property_views')
        ?.insert(viewData)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null,
          error: { 
            message: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
          } 
        };
      }
      return { data: null, error };
    }
  }
};

export default propertyService;