import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { BrandToken } from '@/types';

interface UXAssistantDB extends DBSchema {
  brandTokens: {
    key: string;
    value: BrandToken;
  };
  screenAnalyses: {
    key: string;
    value: any; // ScreenAnalysis
  };
}

class BrandTokenStore {
  private db: IDBPDatabase<UXAssistantDB> | null = null;
  private readonly DB_NAME = 'ux-assistant-db';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<UXAssistantDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // Create brand tokens store
        if (!db.objectStoreNames.contains('brandTokens')) {
          const brandTokensStore = db.createObjectStore('brandTokens', { keyPath: 'id' });
          (brandTokensStore as any).createIndex('id', 'id', { unique: true });
        }

        // Create screen analyses store
        if (!db.objectStoreNames.contains('screenAnalyses')) {
          const screenAnalysesStore = db.createObjectStore('screenAnalyses', { keyPath: 'id' });
          (screenAnalysesStore as any).createIndex('timestamp', 'timestamp');
        }
      },
    });
  }

  async saveBrandToken(token: BrandToken): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.put('brandTokens', token);
  }

  async getBrandToken(id: string): Promise<BrandToken | undefined> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    return await this.db.get('brandTokens', id);
  }

  async getAllBrandTokens(): Promise<BrandToken[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    return await this.db.getAll('brandTokens');
  }

  async deleteBrandToken(id: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.delete('brandTokens', id);
  }

  async getDefaultBrandToken(): Promise<BrandToken> {
    const existing = await this.getAllBrandTokens();
    if (existing.length > 0) {
      return existing[0];
    }

    // Create default brand token
    const defaultToken: BrandToken = {
      id: 'default',
      primaryHex: '#3b82f6', // Blue
      secondaryHex: '#64748b', // Slate
      accentHex: ['#f59e0b', '#10b981', '#ef4444'], // Amber, Emerald, Red
      fontFamily: 'Inter',
      spacingScale: [2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]
    };

    await this.saveBrandToken(defaultToken);
    return defaultToken;
  }

  async saveScreenAnalysis(analysis: any): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.put('screenAnalyses', analysis);
  }

  async getScreenAnalyses(): Promise<any[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    return await this.db.getAll('screenAnalyses');
  }

  async clearAllData(): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.clear('brandTokens');
    await this.db.clear('screenAnalyses');
  }
}

export const brandTokenStore = new BrandTokenStore(); 