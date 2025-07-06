const API_BASE_URL = 'http://localhost:5000/api';

export interface Prediction {
  id: string;
  question: string;
  description: string;
  endDate: string;
  totalStaked: number;
  yesStaked: number;
  noStaked: number;
  category: string;
  contractAddress?: string;
  moduleName?: string;
  functionName?: string;
}

export interface StakeRequest {
  amount: number;
  option: 'yes' | 'no';
  userAddress: string;
}

export interface StakeResponse {
  success: boolean;
  message: string;
  prediction: Prediction;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get all predictions
  async getPredictions(): Promise<Prediction[]> {
    return this.request<Prediction[]>('/predictions');
  }

  // Get single prediction
  async getPrediction(id: string): Promise<Prediction> {
    return this.request<Prediction>(`/predictions/${id}`);
  }

  // Create new prediction
  async createPrediction(prediction: Omit<Prediction, 'id' | 'totalStaked' | 'yesStaked' | 'noStaked'>): Promise<Prediction> {
    return this.request<Prediction>('/predictions', {
      method: 'POST',
      body: JSON.stringify(prediction),
    });
  }

  // Stake on a prediction
  async stakeOnPrediction(predictionId: string, stakeData: StakeRequest): Promise<StakeResponse> {
    return this.request<StakeResponse>(`/predictions/${predictionId}/stake`, {
      method: 'POST',
      body: JSON.stringify(stakeData),
    });
  }

  // Get user stakes
  async getUserStakes(address: string): Promise<any[]> {
    return this.request<any[]>(`/user/${address}/stakes`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService(); 