﻿using System.ComponentModel.DataAnnotations;
using webapi.Entity;

namespace webapi.ViewModel.Musteri
{
    public class MusteriCreateVM
    {
        public int Id { get; set; }
        [Required]
        public string Adi { get; set; }
        [Required]
        public string Soyadi { get; set; }
        [Required]
        public string TelefonNumarasi { get; set; }
        [Required]
        public string Email { get; set; }

        public int FirmaId { get; set; }
        public string FirmaAdi { get; set; }
    }
}
