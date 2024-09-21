import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        default: null
    },
    subSubCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSubCategory",
        default: null
    },
    productName: {
        type: String,
        default: null
    },
    brand: {
        type: String,
        default: null
    },
    otherBrand: {
        type: String,
        default: null
    },
    model: {
        type: String,
        default: null
    },
    conditions: {
        type: String,
        default: null
    },
    price: {
        type: String,
        default: null
    },
    priceFlexibility: {
        type: String,
        default: null
    },
    warrantyStatus: {
        type: String,
        default: null
    },
    additionalDetails: {
        type: String,
        default: null
    },
    features: {
        type: Array,
        default: null
    },
    connectivityFeatures: {
        type: Array,
        default: null
    },
    smartTvFeatures: {
        type: Array,
        default: null
    },
    coolingCapacity: {
        type: String,
        default: null
    },
    energyEfficiency: {
        type: String,
        default: null
    },
    screenSize: {
        type: String,
        default: null
    },
    otherScreenSize: {
        type: String,
        default: null
    },
    storage: {
        type: String,
        default: null
    },
    otherStorage: {
        type: String,
        default: null
    },
    ram: {
        type: String,
        default: null
    },
    otherRam: {
        type: String,
        default: null
    },
    batteryLife: {
        type: String,
        default: null
    },
    type: {
        type: String,
        default: null
    },
    otherType: {
        type: String,
        default: null
    },
    color: {
        type: String,
        default: null
    },
    blenderCapacity: {
        type: String,
        default: null
    },
    compatibility: {
        type: String,
        default: null
    },
    displayType: {
        type: String,
        default: null
    },
    otherDisplayType: {
        type: String,
        default: null
    },
    cuffSize: {
        type: String,
        default: null
    },
    powerSource: {
        type: String,
        default: null
    },
    otherPowerSource: {
        type: String,
        default: null
    },
    feature: {
        type: String,
        default: null
    },
    material: {
        type: String,
        default: null
    },
    otherMaterial: {
        type: String,
        default: null
    },
    size: {
        type: String,
        default: null
    },
    otherSize: {
        type: String,
        default: null
    },
    focalLength: {
        type: String,
        default: null
    },
    aperture: {
        type: String,
        default: null
    },
    maxLoadCapacity: {
        type: String,
        default: null
    },
    megapixels: {
        type: String,
        default: null
    },
    sensorSize: {
        type: String,
        default: null
    },
    lensMount: {
        type: String,
        default: null
    },
    compatibleBrand: {
        type: String,
        default: null
    },
    connectorType: {
        type: String,
        default: null
    },
    otherConnectorType: {
        type: String,
        default: null
    },
    outputSpecification: {
        type: String,
        default: null
    },
    processor: {
        type: String,
        default: null
    },
    otherProcessor: {
        type: String,
        default: null
    },
    graphicsCard: {
        type: String,
        default: null
    },
    otherGraphicsCard: {
        type: String,
        default: null
    },
    operatingSystem: {
        type: String,
        default: null
    },
    otherOperatingSystem: {
        type: String,
        default: null
    },
    memoryCapacity: {
        type: String,
        default: null
    },
    recordingQuality: {
        type: String,
        default: null
    },
    additionalFeatures: {
        type: Array,
        default: null
    },
    capacity: {
        type: String,
        default: null
    },
    otherCapacity: {
        type: String,
        default: null
    },
    connectionType: {
        type: String,
        default: null
    },
    otherConnectionType: {
        type: String,
        default: null
    },
    formFactor: {
        type: String,
        default: null
    },
    otherFormFactor: {
        type: String,
        default: null
    },
    recommendedSkinType: {
        type: String,
        default: null
    },
    otherRecommendedSkinType: {
        type: String,
        default: null
    },
    cleaningBrushType: {
        type: String,
        default: null
    },
    otherCleaningBrushType: {
        type: String,
        default: null
    },
    waterResistance: {
        type: String,
        default: null
    },
    chargingType: {
        type: String,
        default: null
    },
    activityTracking: {
        type: String,
        default: null
    },
    otherActivityTracking: {
        type: String,
        default: null
    },
    resolution: {
        type: String,
        default: null
    },
    storageCapacity: {
        type: String,
        default: null
    },
    otherStorageCapacity: {
        type: String,
        default: null
    },
    includedAccessories: {
        type: String,
        default: null
    },
    compatiblePlatform: {
        type: String,
        default: null
    },
    otherCompatiblePlatform: {
        type: String,
        default: null
    },
    switchType: {
        type: String,
        default: null
    },
    backlighting: {
        type: String,
        default: null
    },
    keyFeatures: {
        type: String,
        default: null
    },
    refreshRate: {
        type: String,
        default: null
    },
    otherRefreshRate: {
        type: String,
        default: null
    },
    dpi: {
        type: String,
        default: null
    },
    connectivity: {
        type: String,
        default: null
    },
    powerRating: {
        type: String,
        default: null
    },
    heatSettings: {
        type: String,
        default: null
    },
    speedSettings: {
        type: String,
        default: null
    },
    attachments: {
        type: String,
        default: null
    },
    cableLength: {
        type: String,
        default: null
    },
    hdmiType: {
        type: String,
        default: null
    },
    otherHdmiType: {
        type: String,
        default: null
    },
    compatibleHeadphoneModels: {
        type: String,
        default: null
    },
    shavingSystem: {
        type: String,
        default: null
    },
    otherShavingSystem: {
        type: String,
        default: null
    },
    cleaningSystem: {
        type: String,
        default: null
    },
    compatibilityAccessories: {
        type: String,
        default: null
    },
    trackingMetrics: {
        type: String,
        default: null
    },
    voiceAssistance: {
        type: String,
        default: null
    },
    otherVoiceAssistance: {
        type: String,
        default: null
    },
    colorTemperature: {
        type: String,
        default: null
    },
    brightness: {
        type: String,
        default: null
    },
    smartFeatures: {
        type: String,
        default: null
    },
    installationType: {
        type: String,
        default: null
    },
    measurementMetrics: {
        type: String,
        default: null
    },
    maxWeightCapacity: {
        type: String,
        default: null
    },
    indoorOutdoor: {
        type: String,
        default: null
    },
    compatibleOperatingSystem: {
        type: String,
        default: null
    },
    OtherCompatibleOperatingSystem: {
        type: String,
        default: null
    },
    brandMaterial: {
        type: String,
        default: null
    },
    otherBrandMaterial: {
        type: String,
        default: null
    },
    numberOfSlices: {
        type: String,
        default: null
    },
    mountType: {
        type: String,
        default: null
    },
    otherMountType: {
        type: String,
        default: null
    },
    compatibleTvSize: {
        type: String,
        default: null
    },
    weightCapacity: {
        type: String,
        default: null
    },
    screenType: {
        type: String,
        default: null
    },
    otherScreenType: {
        type: String,
        default: null
    },
    remoteType: {
        type: String,
        default: null
    },
    otherRemoteType: {
        type: String,
        default: null
    },
    newPrice: {
        type: String,
        default: null
    },
    isConfirmRequest: {
       type: Boolean,
       default: false
    },
    rejectionReason: {
        type: String,
        default: null
    },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

export default Item;
