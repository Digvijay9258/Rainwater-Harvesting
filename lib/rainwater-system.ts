export class Sensor {
  type: string
  value: number

  constructor(sensorType: string) {
    this.type = sensorType
    this.value = 0
  }

  read(): number {
    return this.value
  }

  simulate(value: number): void {
    this.value = value
  }
}

export class RoofTopHarvester {
  roofArea: number
  waterCollected: number

  constructor(roofArea: number) {
    this.roofArea = roofArea
    this.waterCollected = 0
  }

  collect(rainfallMm: number): number {
    this.waterCollected = this.roofArea * rainfallMm
    return this.waterCollected
  }
}

export class FilterUnit {
  efficiency: number

  constructor(efficiency = 0.95) {
    this.efficiency = efficiency
  }

  process(waterIn: number): number {
    return waterIn * this.efficiency
  }
}

export class StorageTank {
  capacity: number
  currentLevel: number
  ultrasonicSensor: Sensor

  constructor(capacityLiters: number) {
    this.capacity = capacityLiters
    this.currentLevel = 0
    this.ultrasonicSensor = new Sensor("water_level")
  }

  store(waterLiters: number): number {
    const availableSpace = this.capacity - this.currentLevel
    const stored = Math.min(waterLiters, availableSpace)
    this.currentLevel += stored
    this.ultrasonicSensor.simulate(this.currentLevel)
    return stored
  }

  overflow(): number {
    return Math.max(0, this.currentLevel - this.capacity)
  }

  getCurrentLevel(): number {
    return this.currentLevel
  }

  getCapacityPercentage(): number {
    return (this.currentLevel / this.capacity) * 100
  }
}

export class WaterQuality {
  tdsSensor: Sensor
  turbiditySensor: Sensor

  constructor() {
    this.tdsSensor = new Sensor("TDS")
    this.turbiditySensor = new Sensor("turbidity")
  }

  checkQuality(): boolean {
    return this.tdsSensor.read() < 300 && this.turbiditySensor.read() < 5
  }

  getQualityStatus(): {
    tds: number
    turbidity: number
    isAcceptable: boolean
    message: string
  } {
    const tds = this.tdsSensor.read()
    const turbidity = this.turbiditySensor.read()
    const isAcceptable = this.checkQuality()

    return {
      tds,
      turbidity,
      isAcceptable,
      message: isAcceptable
        ? "Water quality is acceptable for recharge"
        : "Water quality is NOT acceptable for recharge",
    }
  }
}

export class ArtificialRecharge {
  capacity: number
  totalRecharged: number

  constructor(rechargeCapacity: number) {
    this.capacity = rechargeCapacity
    this.totalRecharged = 0
  }

  recharge(waterLiters: number): number {
    const recharged = Math.min(waterLiters, this.capacity)
    this.totalRecharged += recharged
    return recharged
  }

  getTotalRecharged(): number {
    return this.totalRecharged
  }
}

// System manager class to coordinate all components
export class RainwaterHarvestingSystem {
  harvester: RoofTopHarvester
  filterUnit: FilterUnit
  storageTank: StorageTank
  waterQuality: WaterQuality
  rechargeUnit: ArtificialRecharge

  constructor() {
    this.harvester = new RoofTopHarvester(100) // 100 sq meters roof area
    this.filterUnit = new FilterUnit(0.95) // 95% efficiency
    this.storageTank = new StorageTank(5000) // 5000 liters capacity
    this.waterQuality = new WaterQuality()
    this.rechargeUnit = new ArtificialRecharge(4000) // 4000 liters recharge capacity
  }

  processRainfall(rainfallMm: number) {
    const harvested = this.harvester.collect(rainfallMm)
    const filtered = this.filterUnit.process(harvested)
    const stored = this.storageTank.store(filtered)
    const excess = filtered - stored

    return {
      harvested,
      filtered,
      stored,
      excess,
      tankLevel: this.storageTank.getCurrentLevel(),
      tankPercentage: this.storageTank.getCapacityPercentage(),
    }
  }

  checkWaterQuality(tds: number, turbidity: number) {
    this.waterQuality.tdsSensor.simulate(tds)
    this.waterQuality.turbiditySensor.simulate(turbidity)
    return this.waterQuality.getQualityStatus()
  }

  performRecharge(excessWater: number) {
    const recharged = this.rechargeUnit.recharge(excessWater)
    return {
      recharged,
      totalRecharged: this.rechargeUnit.getTotalRecharged(),
    }
  }

  getSystemStatus() {
    return {
      tankLevel: this.storageTank.getCurrentLevel(),
      tankCapacity: this.storageTank.capacity,
      tankPercentage: this.storageTank.getCapacityPercentage(),
      totalRecharged: this.rechargeUnit.getTotalRecharged(),
      rechargeCapacity: this.rechargeUnit.capacity,
    }
  }
}
