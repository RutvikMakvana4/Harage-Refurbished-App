import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },
    subSubCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSubCategory",
      default: null,
    },
    productName: {
      type: String,
      default: null,
    },
    brand: {
      type: String,
      default: null,
    },
    model: {
      type: String,
      default: null,
    },
    screenSize: {
      type: String,
      default: null,
    },
    screenType: {
      type: String,
      default: null,
    },
    resolution: {
      type: String,
      default: null,
    },
    smartTv: {
      type: Boolean,
      default: false,
    },
    hdr: {
      type: Boolean,
      default: false,
    },
    condition: {
      type: String,
      default: null,
    },
    price: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    connectivity: {
      type: String,
      default: null,
    },
    earCoupling: {
      type: String,
      default: null,
    },
    headphoneStyle: {
      type: String,
      default: null,
    },
    noiseCancellationLevel: {
      type: String,
      default: null,
    },
    includedSubwooder: {
      type: Boolean,
      default: false,
    },
    powerOutput: {
      type: String,
      default: null,
    },
    channelConfiguration: {
      type: String,
      default: null,
    },
    includedSoundbar: {
      type: Boolean,
      default: false,
    },
    includedReceiver: {
      type: Boolean,
      default: false,
    },
    includedSubwoofer: {
      type: Boolean,
      default: false,
    },
    speakerConfiguration: {
      type: String,
      default: null,
    },
    systemType: {
      type: String,
      default: null,
    },
    componentIncluded: {
      type: String,
      default: null,
    },
    expandableStorage: {
      type: Boolean,
      default: false,
    },
    internalStorage: {
      type: String,
      default: null,
    },
    microphoneType: {
      type: String,
      default: null,
    },
    recordingFormats: {
      type: String,
      default: null,
    },
    compatibleHeadphoneModel: {
      type: String,
      default: null,
    },
    mountType: {
      type: String,
      default: null,
    },
    vesaCompatibility: {
      type: String,
      default: null,
    },
    weightCapacity: {
      type: String,
      default: null,
    },
    screenSizeRange: {
      type: String,
      default: null,
    },
    length: {
      type: String,
      default: null,
    },
    hdmiVersion: {
      type: String,
      default: null,
    },
    remoteCompatibility: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    formFactor: {
      type: String,
      default: null,
    },
    processor: {
      type: String,
      default: null,
    },
    ram: {
      type: String,
      default: null,
    },
    storage: {
      type: String,
      default: null,
    },
    graphicsCard: {
      type: String,
      default: null,
    },
    operatingSystem: {
      type: String,
      default: null,
    },
    displayResolution: {
      type: String,
      default: null,
    },
    displaySize: {
      type: String,
      default: null,
    },
    displayRefreshRate: {
      type: String,
      default: null,
    },
    switchType: {
      type: String,
      default: null,
    },
    layout: {
      type: String,
      default: null,
    },
    sensorType: {
      type: String,
      default: null,
    },
    maxDpi: {
      type: String,
      default: null,
    },
    numberOfButtons: {
      type: String,
      default: null,
    },
    headedness: {
      type: String,
      default: null,
    },
    material: {
      type: String,
      default: null,
    },
    bagType: {
      type: String,
      default: null,
    },
    fitsLaptopSize: {
      type: String,
      default: null,
    },
    storageCapacity: {
      type: String,
      default: null,
    },
    driveType: {
      type: String,
      default: null,
    },
    interface: {
      type: String,
      default: null,
    },
    networkCompatibility: {
      type: String,
      default: null,
    },
    carrier: {
      type: String,
      default: null,
    },
    displayType: {
      type: String,
      default: null,
    },
    cameraDetails: {
      type: String,
      default: null,
    },
    compatibility: {
      type: String,
      default: null,
    },
    bandStyle: {
      type: String,
      default: null,
    },
    caseType: {
      type: String,
      default: null,
    },
    chargerType: {
      type: String,
      default: null,
    },
    outputPower: {
      type: String,
      default: null,
    },
    connectorType: {
      type: String,
      default: null,
    },
    compatibleDevices: {
      type: String,
      default: null,
    },
    accessories: {
      type: String,
      default: null,
    },
    discEdition: {
      type: String,
      default: null,
    },
    consoleGeneration: {
      type: String,
      default: null,
    },
    consoleModel: {
      type: String,
      default: null,
    },
    compatiblePlatforms: {
      type: String,
      default: null,
    },
    connectionType: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: null,
    },
    gripStyle: {
      type: String,
      default: null,
    },
    weight: {
      type: String,
      default: null,
    },
    platformCompatibility: {
      type: String,
      default: null,
    },
    audioType: {
      type: String,
      default: null,
    },
    microphone: {
      type: String,
      default: null,
    },
    refrigeratorType: {
      type: String,
      default: null,
    },
    totalCapacity: {
      type: String,
      default: null,
    },
    washerType: {
      type: String,
      default: null,
    },
    capacity: {
      type: String,
      default: null,
    },
    acType: {
      type: String,
      default: null,
    },
    coolingCapacity: {
      type: String,
      default: null,
    },
    vacuumType: {
      type: String,
      default: null,
    },
    cordedCordless: {
      type: String,
      default: null,
    },
    sliceCapacity: {
      type: String,
      default: null,
    },
    blenderType: {
      type: String,
      default: null,
    },
    jarCapacity: {
      type: String,
      default: null,
    },
    power: {
      type: String,
      default: null,
    },
    coffeeType: {
      type: String,
      default: null,
    },
    hvacSystemCompatibility: {
      type: String,
      default: null,
    },
    deviceType: {
      type: String,
      default: null,
    },
    videoResolution: {
      type: String,
      default: null,
    },
    suitableFor: {
      type: String,
      default: null,
    },
    lockType: {
      type: String,
      default: null,
    },
    lightingType: {
      type: String,
      default: null,
    },
    shaverType: {
      type: String,
      default: null,
    },
    wattage: {
      type: String,
      default: null,
    },
    hairDryerType: {
      type: String,
      default: null,
    },
    primaryUseCases: {
      type: String,
      default: null,
    },
    compatibleWith: {
      type: String,
      default: null,
    },
    monitorType: {
      type: String,
      default: null,
    },
    display: {
      type: String,
      default: null,
    },
    wearStyle: {
      type: String,
      default: null,
    },
    sleepTracking: {
      type: String,
      default: null,
    },
    measurements: {
      type: String,
      default: null,
    },
    compatibleApps: {
      type: String,
      default: null,
    },
    maxVideoResolution: {
      type: String,
      default: null,
    },
    cameraType: {
      type: String,
      default: null,
    },
    sensorSize: {
      type: String,
      default: null,
    },
    megaPixels: {
      type: String,
      default: null,
    },
    lensMount: {
      type: String,
      default: null,
    },
    lensType: {
      type: String,
      default: null,
    },
    includedLenses: {
      type: String,
      default: null,
    },
    primaryMaterial: {
      type: String,
      default: null,
    },
    focalLength: {
      type: String,
      default: null,
    },
    maximumAperture: {
      type: String,
      default: null,
    },
    tripodType: {
      type: String,
      default: null,
    },
    maximumHeight: {
      type: String,
      default: null,
    },
    foldedLength: {
      type: String,
      default: null,
    },
    loadCapacity: {
      type: String,
      default: null,
    },
    headType: {
      type: String,
      default: null,
    },
    thickness: {
      type: String,
      default: null,
    },
    batteryLife: {
      type: String,
      default: null,
    },
    compatiblePhoneModel: {
      type: String,
      default: null,
    },
    systemCompatibility: {
      type: String,
      default: null,
    },
    handedness: {
      type: String,
      default: null,
    },
    appCompatibility: {
      type: String,
      default: null,
    },
    stereoPairing: {
      type: Boolean,
      default: false,
    },
    multiroomSupport: {
      type: Boolean,
      default: false,
    },
    waterproof: {
      type: Boolean,
      default: false,
    },
    displayScreen: {
      type: Boolean,
      default: false,
    },
    bluetoothSupport: {
      type: Boolean,
      default: false,
    },
    warrantyStatus: {
      type: String,
      default: null,
    },
    additionalFeatures: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    isSaveDraft: {
      type: Boolean,
      default: false,
    },
    isPurchased: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      default: 1, // 1 - available  2 - processing   3 - delivered   4 - purchased   5 - Refunded   6 - Returned
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
