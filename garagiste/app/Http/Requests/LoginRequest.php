<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required',
            'password' => 'required'
        ];
    }

        /**
         * Get the needed authorization credentials from the request.
         *
         * @return array
         * @throws \Illuminate\Contracts\Container\BindingResolutionException
         */

         
        public function getCredentials()
        {
            // The form field for providing username or password
            // have name of "username", however, in order to support
            // logging users in with both (username and email)
            // we have to check if user has entered one or another
                return [
                    'email' => $this->get('email'),
                    'password' => $this->get('password')
                ];

            return $this->only('email', 'password');
        }

      
     
}
