interface RainwaterData {
  id?: string
  timestamp: string
  type: "collection" | "quality" | "recharge"
  data: any
}

interface SystemState {
  tankLevel: number
  tankCapacity: number
  totalRecharged: number
  rechargeCapacity: number
  lastUpdated: string
}

class RainwaterDatabase {
  private storageKey = "rainwater_harvesting_data"
  private stateKey = "rainwater_system_state"

  // Initialize default system state
  private getDefaultState(): SystemState {
    return {
      tankLevel: 0,
      tankCapacity: 5000,
      totalRecharged: 0,
      rechargeCapacity: 10000,
      lastUpdated: new Date().toISOString(),
    }
  }

  // Get system state
  getSystemState(): SystemState {
    if (typeof window === "undefined") return this.getDefaultState()

    const stored = localStorage.getItem(this.stateKey)
    return stored ? JSON.parse(stored) : this.getDefaultState()
  }

  // Update system state
  updateSystemState(updates: Partial<SystemState>): SystemState {
    const current = this.getSystemState()
    const updated = {
      ...current,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(this.stateKey, JSON.stringify(updated))
    }

    return updated
  }

  // Save data entry
  saveData(entry: Omit<RainwaterData, "id" | "timestamp">): RainwaterData {
    const data: RainwaterData = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...entry,
    }

    if (typeof window !== "undefined") {
      const existing = this.getAllData()
      existing.push(data)
      localStorage.setItem(this.storageKey, JSON.stringify(existing))
    }

    return data
  }

  // Get all data
  getAllData(): RainwaterData[] {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem(this.storageKey)
    return stored ? JSON.parse(stored) : []
  }

  // Get data by type
  getDataByType(type: RainwaterData["type"]): RainwaterData[] {
    return this.getAllData().filter((entry) => entry.type === type)
  }

  // Get recent data (last 30 days)
  getRecentData(days = 30): RainwaterData[] {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    return this.getAllData().filter((entry) => new Date(entry.timestamp) >= cutoff)
  }

  // Calculate water savings over time
  getWaterSavingsStats() {
    const collections = this.getDataByType("collection")
    const recharges = this.getDataByType("recharge")

    const totalHarvested = collections.reduce((sum, entry) => sum + (entry.data.harvested || 0), 0)

    const totalRecharged = recharges.reduce((sum, entry) => sum + (entry.data.recharged || 0), 0)

    return {
      totalHarvested,
      totalRecharged,
      totalSaved: totalHarvested + totalRecharged,
      entriesCount: collections.length + recharges.length,
    }
  }

  // Clear all data (for testing)
  clearAllData(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.storageKey)
      localStorage.removeItem(this.stateKey)
    }
  }
}

export const db = new RainwaterDatabase()
export type { RainwaterData, SystemState }
