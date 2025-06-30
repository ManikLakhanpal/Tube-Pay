"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { User, Download, Copy } from "lucide-react";
import QRCode from "qrcode";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function QRCodeCard() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  
  // Construct the full URL with #support
  const currentURL = typeof window !== 'undefined' 
    ? `${window.location.origin}${pathname}#support`
    : '';

  // Generate QR code when currentURL changes
  useEffect(() => {
    const generateQRCode = async () => {
      if (currentURL) {
        try {
          const dataUrl = await QRCode.toDataURL(currentURL, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrCodeDataUrl(dataUrl);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQRCode();
  }, [currentURL]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = 'donation-qr-code.png';
      link.href = qrCodeDataUrl;
      link.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code for Donations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {qrCodeDataUrl && (
            <div className="bg-white p-4 rounded-lg border">
              <Image
                src={qrCodeDataUrl}
                alt="QR Code for donations"
                width={200}
                height={200}
                className="rounded"
              />
            </div>
          )}
          
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Share this QR code with your viewers to get donations
            </p>
          </div>

          <div className="flex space-x-2 w-full">
            <Button
              onClick={handleCopyUrl}
              variant="outline"
              className="flex-1 min-w-0 flex items-center justify-center space-x-1 text-sm"
            >
              <Copy className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{copied ? 'Copied!' : 'Copy URL'}</span>
            </Button>
            
            <Button
              onClick={handleDownloadQR}
              variant="outline"
              className="flex-1 min-w-0 flex items-center justify-center space-x-1 text-sm"
            >
              <Download className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Download</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 