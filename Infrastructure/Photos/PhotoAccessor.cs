using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;

        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
        }
        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {
            if (file.Length > 0)
            {
                await using var stream = file.OpenReadStream();
                var upLoadParams = new ImageUploadParams
                {
                    File= new FileDescription(file.Name,stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill")
                };
                var upLoadResult = await _cloudinary.UploadAsync(upLoadParams);
                if(upLoadResult.Error != null)
                {
                    throw new Exception(upLoadResult.Error.Message);
                }
                return new PhotoUploadResult
                {
                    PublicId = upLoadResult.PublicId,
                    Url= upLoadResult.Url.ToString()
                };
            }

            return null;
        }

        public async Task<string> DeletePhoto(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result =="ok" ? result.Result : null;
        }
    }
}