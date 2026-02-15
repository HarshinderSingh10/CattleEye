import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import cattleHeroBg from "@/assets/cattle-hero-bg.jpg";
import girCowReference from "@/assets/gir-cow-reference.jpg";

interface BreedResult {
  breed: string;
  population: string;
  milkProduction: string;
  strengths: string[];
  lifespan: string;
  image: string;
}

export const BreedDetector = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BreedResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Handle image selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size too large. Please select an image under 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);
        analyzeImage(file); // ✅ Call prediction immediately after upload
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Analyze image by calling backend API
  const analyzeImage = async (file: File) => {
    try {
      setIsAnalyzing(true);
      toast("Analyzing image...");

      const formData = new FormData();
      formData.append("image", file);

      // 🔗 Replace this URL with your actual backend prediction API
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      console.log("Prediction result:", data);

      // ✅ Expecting backend response like:
      // { breed: "Gir", confidence: 0.92 }

      const breedInfo: Record<string, BreedResult> = {
        Gir: {
          breed: "Gir Cow",
          population: "~2 million in India",
          milkProduction: "10-12 liters/day",
          strengths: [
            "Heat resistant",
            "Disease resistant",
            "A2 milk production",
            "Low maintenance",
          ],
          lifespan: "12-15 years",
          image: girCowReference,
        },
        Murrah: {
          breed: "Murrah Buffalo",
          population: "~1.5 million in India",
          milkProduction: "20-25 liters/day",
          strengths: ["High milk yield", "Strong build", "Adaptable climate"],
          lifespan: "15-20 years",
          image: girCowReference,
        },
        Jaffarabadi: {
          breed: "Jaffarabadi Buffalo",
          population: "~1 million in India",
          milkProduction: "18-22 liters/day",
          strengths: [
            "Heavyweight breed",
            "Strong immunity",
            "High-fat milk content",
          ],
          lifespan: "16-18 years",
          image: girCowReference,
        },
      };

      const predictedBreed =
        data.breed && breedInfo[data.breed]
          ? breedInfo[data.breed]
          : breedInfo["Gir"];

      setResult(predictedBreed);
      toast.success(`Detected: ${predictedBreed.breed}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetDetection = () => {
    setUploadedImage(null);
    setResult(null);
    setIsAnalyzing(false);
  };

    return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={cattleHeroBg}
          alt="Cattle farm background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Hero Text */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            🐄 Know Your Cattle, Grow Your Farm
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Smart Farming with AI for Every Farmer
          </p>
        </div>

        {/* Upload Section */}
        {!uploadedImage && !result && !isAnalyzing && (
          <Card className="shadow-[var(--card-shadow)] hover:shadow-[var(--hover-shadow)] transition-shadow duration-300 animate-scale-in">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-md space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full h-16"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6" />
                    Upload Image
                  </Button>

                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full h-16"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <Camera className="w-6 h-6" />
                    Capture Photo
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    📸 Upload or capture a clear photo of your cattle
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports: JPG, PNG • Max size: 10MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analyzing State */}
        {isAnalyzing && (
          <Card className="shadow-[var(--card-shadow)] animate-scale-in">
            <CardContent className="p-12">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                  <div className="absolute inset-0 animate-pulse bg-primary/20 rounded-full blur-xl" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-2">
                    Analyzing Your Cattle...
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI is identifying the breed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ✅ Output Section */}
        {uploadedImage && !isAnalyzing && !result && (
          <Card className="mt-8 p-6 bg-muted/50 animate-fade-in">
            <CardContent>
              <div className="text-center space-y-3">
                <h2 className="text-xl font-semibold text-destructive">
                  ❌ Analysis Failed
                </h2>
                <p className="text-muted-foreground">
                  We couldn’t identify the breed. Please try another image or check backend logs.
                </p>
                <Button variant="ghost" onClick={resetDetection}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Display */}
        {result && uploadedImage && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-end">
              <Button variant="ghost" onClick={resetDetection} className="gap-2">
                <X className="w-4 h-4" />
                Detect Another
              </Button>
            </div>

              <Card className="shadow-[var(--card-shadow)] overflow-hidden">
                  <CardContent className="p-0">
                      <div className="grid md:grid-cols-1 gap-0">
                      <div className="relative aspect-square bg-muted">
            <img
              src={uploadedImage}
              alt="Your uploaded image"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-white font-semibold">Your Image</p>
            </div>
          </div></div>


                {/* Breed Info */}
                <div className="p-6 md:p-8 space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {result.breed}
                    </h2>
                    <p className="text-muted-foreground">Breed Detected</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <InfoCard
                      icon="🌍"
                      label="Population in India"
                      value={result.population}
                    />
                    <InfoCard
                      icon="🥛"
                      label="Average Milk Production"
                      value={result.milkProduction}
                    />
                    <InfoCard icon="⏳" label="Lifespan" value={result.lifespan} />
                    <div className="md:col-span-2">
                      <InfoCard
                        icon="💪"
                        label="Key Strengths"
                        value={
                          <ul className="list-disc list-inside space-y-1">
                            {result.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={cattleHeroBg}
          alt="Cattle farm background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Hero Text */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            🐄 Know Your Cattle, Grow Your Farm
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Smart Farming with AI for Every Farmer
          </p>
        </div>

        {/* Upload Section */}
        {!uploadedImage && !result && (
          <Card className="shadow-[var(--card-shadow)] hover:shadow-[var(--hover-shadow)] transition-shadow duration-300 animate-scale-in">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-md space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full h-16"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6" />
                    Upload Image
                  </Button>

                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full h-16"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <Camera className="w-6 h-6" />
                    Capture Photo
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    📸 Upload or capture a clear photo of your cattle
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports: JPG, PNG • Max size: 10MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analyzing State */}
        {isAnalyzing && (
          <Card className="shadow-[var(--card-shadow)] animate-scale-in">
            <CardContent className="p-12">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                  <div className="absolute inset-0 animate-pulse bg-primary/20 rounded-full blur-xl" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-2">
                    Analyzing Your Cattle...
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI is identifying the breed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Display */}
        {result && uploadedImage && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-end">
              <Button variant="ghost" onClick={resetDetection} className="gap-2">
                <X className="w-4 h-4" />
                Detect Another
              </Button>
            </div>

            <Card className="shadow-[var(--card-shadow)] overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={uploadedImage}
                      alt="Your uploaded image"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white font-semibold">Your Image</p>
                    </div>
                  </div>
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={result.image}
                      alt={result.breed}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white font-semibold">
                        Reference Image
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {result.breed}
                    </h2>
                    <p className="text-muted-foreground">Breed Detected</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <InfoCard
                      icon="🌍"
                      label="Population in India"
                      value={result.population}
                    />
                    <InfoCard
                      icon="🥛"
                      label="Average Milk Production"
                      value={result.milkProduction}
                    />
                    <InfoCard
                      icon="⏳"
                      label="Lifespan"
                      value={result.lifespan}
                    />
                    <div className="md:col-span-2">
                      <InfoCard
                        icon="💪"
                        label="Key Strengths"
                        value={
                          <ul className="list-disc list-inside space-y-1">
                            {result.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

interface InfoCardProps {
  icon: string;
  label: string;
  value: React.ReactNode;
}

const InfoCard = ({ icon, label, value }: InfoCardProps) => (
  <div className="bg-muted rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3">
      <span className="text-3xl">{icon}</span>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <div className="font-semibold text-foreground">{value}</div>
      </div>
    </div>
  </div>
);

